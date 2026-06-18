import type { Comment } from "@/types/comment.types";

const comments: Comment[] = [
  {
    id: "c1",
    content: "Great post! Really enjoyed reading it.",
    authorId: "u1",
    author: {
      firstName: "John",
      lastName: "Doe",
      photoURL: "https://i.pravatar.cc/150?img=1",
    },
    isDeleted: false,
    replyCount: 2,
    createdAt: new Date("2026-06-16T10:00:00Z"),
    updatedAt: new Date("2026-06-16T10:00:00Z"),
  },
  {
    id: "c2",
    content: "I completely agree with your point.",
    authorId: "u2",
    parentId: "c1",
    author: {
      firstName: "Emma",
      lastName: "Wilson",
      photoURL: "https://i.pravatar.cc/150?img=2",
    },
    isDeleted: false,
    replyCount: 0,
    createdAt: new Date("2026-06-16T10:05:00Z"),
    updatedAt: new Date("2026-06-16T10:05:00Z"),
  },
  {
    id: "c3",
    content: "Interesting perspective. Thanks for sharing!",
    authorId: "u3",
    parentId: "c1",
    author: {
      firstName: "Michael",
      lastName: "Brown",
      photoURL: "https://i.pravatar.cc/150?img=3",
    },
    isDeleted: false,
    replyCount: 1,
    createdAt: new Date("2026-06-16T10:10:00Z"),
    updatedAt: new Date("2026-06-16T10:10:00Z"),
  },
  {
    id: "c4",
    content: "Could you explain this part in more detail?",
    authorId: "u4",
    parentId: "c3",
    author: {
      firstName: "Sophia",
      lastName: "Taylor",
      photoURL: "https://i.pravatar.cc/150?img=4",
    },
    isDeleted: false,
    replyCount: 0,
    createdAt: new Date("2026-06-16T10:15:00Z"),
    updatedAt: new Date("2026-06-16T10:15:00Z"),
  },
  {
    id: "c5",
    content: "This helped me solve a similar problem.",
    authorId: "u5",
    author: {
      firstName: "Daniel",
      lastName: "Miller",
      photoURL: "https://i.pravatar.cc/150?img=5",
    },
    isDeleted: false,
    replyCount: 0,
    createdAt: new Date("2026-06-16T10:20:00Z"),
    updatedAt: new Date("2026-06-16T10:20:00Z"),
  },
  {
    id: "c6",
    content: "Not sure I agree with this approach.",
    authorId: "u6",
    author: {
      firstName: "Olivia",
      lastName: "Davis",
      photoURL: "https://i.pravatar.cc/150?img=6",
    },
    isDeleted: false,
    replyCount: 1,
    createdAt: new Date("2026-06-16T10:25:00Z"),
    updatedAt: new Date("2026-06-16T10:25:00Z"),
  },
  {
    id: "c7",
    content: "What alternative would you suggest?",
    authorId: "u7",
    parentId: "c6",
    author: {
      firstName: "James",
      lastName: "Anderson",
      photoURL: "https://i.pravatar.cc/150?img=7",
    },
    isDeleted: false,
    replyCount: 0,
    createdAt: new Date("2026-06-16T10:30:00Z"),
    updatedAt: new Date("2026-06-16T10:30:00Z"),
  },
  {
    id: "c8",
    content: "Saved this for later reference.",
    authorId: "u8",
    author: {
      firstName: "Ava",
      lastName: "Thomas",
      photoURL: "https://i.pravatar.cc/150?img=8",
    },
    isDeleted: false,
    replyCount: 0,
    createdAt: new Date("2026-06-16T10:35:00Z"),
    updatedAt: new Date("2026-06-16T10:35:00Z"),
  },
  {
    id: "c9",
    content: "Thanks! This was very informative.",
    authorId: "u9",
    author: {
      firstName: "William",
      lastName: "Moore",
      photoURL: "https://i.pravatar.cc/150?img=9",
    },
    isDeleted: false,
    replyCount: 0,
    createdAt: new Date("2026-06-16T10:40:00Z"),
    updatedAt: new Date("2026-06-16T10:40:00Z"),
  },
  {
    id: "c10",
    content: "Looking forward to more content like this.",
    authorId: "u10",
    author: {
      firstName: "Mia",
      lastName: "Jackson",
      photoURL: "https://i.pravatar.cc/150?img=10",
    },
    isDeleted: false,
    replyCount: 0,
    createdAt: new Date("2026-06-16T10:45:00Z"),
    updatedAt: new Date("2026-06-16T10:45:00Z"),
  },
];

type CommentNode = Comment & {
  replies: CommentNode[];
};

function buildCommentTree(comments: Comment[]): CommentNode[] {
  const map = new Map<string, CommentNode>();

  comments.forEach((comment) => {
    map.set(comment.id, {
      ...comment,
      replies: [],
    });
  });

  const roots: CommentNode[] = [];

  comments.forEach((comment) => {
    const node = map.get(comment.id)!;

    if (comment.parentId) {
      const parent = map.get(comment.parentId);

      if (parent) {
        parent.replies.push(node);
      }
    } else {
      roots.push(node);
    }
  });

  return roots;
}

export default function CommentList() {
  const commentTree = buildCommentTree(comments);

  console.log("Comment Tree:", commentTree);

  return <div></div>;
}
