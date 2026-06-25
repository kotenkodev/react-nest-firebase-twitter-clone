import { onSchedule } from 'firebase-functions/v2/scheduler';
import * as admin from 'firebase-admin';
import { logger } from 'firebase-functions';

export const cleanupOrphanedComments = onSchedule(
  {
    schedule: '0 0 * * 0',
    timeZone: 'UTC',
  },
  async (event) => {
    const db = admin.firestore();

    try {
      logger.info('Starting scheduled cleanup for soft-deleted comments...');

      const snapshot = await db
        .collection('comments')
        .where('isDeleted', '==', true)
        .where('replyCount', '==', 0)
        .get();

      if (snapshot.empty) {
        logger.info('No orphaned comments found to clean up.');
        return;
      }

      logger.info(`Found ${snapshot.size} orphaned comments. Deleting...`);

      const batch = db.batch();
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      logger.info(`Successfully deleted ${snapshot.size} orphaned comments.`);
    } catch (error) {
      logger.error('Error running comment cleanup cron job:', error);
    }
  },
);
