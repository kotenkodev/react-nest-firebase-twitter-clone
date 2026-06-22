import { auth } from 'firebase-functions/v1';
import * as admin from 'firebase-admin';
import { logger } from 'firebase-functions';
import { UserRecord } from 'firebase-admin/auth';

export const onUserAccountDeleted = auth
  .user()
  .onDelete(async (user: UserRecord) => {
    const uid = user.uid;
    const db = admin.firestore();
    const bucket = admin.storage().bucket();

    logger.info(`User ${uid} deleted. Starting anonymization...`);

    await db.collection('users').doc(uid).delete();

    try {
      const avatarRef = bucket.file(`avatars/${uid}`);
      await avatarRef.delete();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'code' in err && err.code !== 404) {
        logger.error('Failed to delete avatar:', err);
      }
    }

    const postsSnapshot = await db
      .collection('posts')
      .where('authorId', '==', uid)
      .get();
    const postsBatch = db.batch();
    postsSnapshot.docs.forEach((doc) => {
      postsBatch.update(doc.ref, {
        'author.firstName': 'Deleted',
        'author.lastName': 'User',
        'author.photoURL': null,
        authorId: 'deleted_user',
        isAnonymized: true,
      });
    });
    if (!postsSnapshot.empty) await postsBatch.commit();

    const commentsSnapshot = await db
      .collection('comments')
      .where('authorId', '==', uid)
      .get();
    const commentsBatch = db.batch();
    commentsSnapshot.docs.forEach((doc) => {
      commentsBatch.update(doc.ref, {
        'author.firstName': 'Deleted',
        'author.lastName': 'User',
        'author.photoURL': null,
        authorId: 'deleted_user',
        isDeleted: true,
      });
    });
    if (!commentsSnapshot.empty) await commentsBatch.commit();

    logger.info(`Successfully anonymized data for user: ${uid}`);
  });
