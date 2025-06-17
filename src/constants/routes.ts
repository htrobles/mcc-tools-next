const routes = [
  {
    key: 'home',
    path: '/',
    title: 'Welcome to Music City Canada Tools',
    description:
      'This app provides a set of tools to manage our store easier and faster.',
  },
  {
    key: 'supplier-master-feed',
    path: '/supplier-master-feed',
    title: 'Supplier Master Feed',
    description:
      'This tool creates a Master Supplies Feed CSV file using the data from the suppliers.',
  },
  {
    key: 'price-update',
    path: '/price-update',
    title: 'Price Update',
    description: 'This tool is used to update product prices',
  },
  {
    key: 'product-update',
    path: '/product-update',
    title: 'Product Update',
    description:
      'This tool is used to update products that have the update tags',
  },
  {
    key: 'price-monitor',
    path: '/price-monitor',
    title: 'Price Monitor',
    description: 'This tool is used to monitor competitor product prices',
  },
];

export default routes;
