export const seedAppRoles = [
  {
    name: 'Admin',
    normalizedName: 'admin',
    permissions: [
      'write.all',
      'read.all',
    ],
  },
  {
    name: 'Developer',
    normalizedName: 'developer',
    permissions: [
      'write',
      'read',
    ],
  },
  {
    name: 'Member',
    normalizedName: 'member',
    permissions: [
      'read',
    ],
  },
];
