'use server';

export default async function addPriceMonitorProducts(file: File) {
  if (!file) {
    throw new Error('No file provided');
  }

  const host = process.env.NEXT_PUBLIC_MONITOR_PRICE_APP_HOST;
  if (!host) {
    throw new Error(
      'NEXT_PUBLIC_MONITOR_PRICE_APP_HOST environment variable is not set'
    );
  }

  try {
    // Convert File to FormData for multipart/form-data upload
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${host}/api/products/import`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to import products: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error importing products to price monitor app:', error);
    throw error;
  }
}
