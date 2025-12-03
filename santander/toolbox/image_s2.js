var s2a = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(aoi)
  .filterDate('2018-01-01', '2018-12-31')
  .select('B2', 'B3', 'B4', 'B5')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10));

// Combine all available images into a single mosaic
var image = s2a.median().clip(aoi);

// Visualization in RGB
var visualize = {
  bands: ['B4', 'B3', 'B2'],
  min: 0,
  max: 3000,
  gamma: 1.4
};

// Map display
Map.centerObject(aoi, 9);
Map.addLayer(aoi, {}, 'AOI');
Map.addLayer(image, visualize, 'Sentinel-2 median');

print(s2a);

// Export to Google Drive
Export.image.toDrive({
  image: image,
  description: 'image_s2',
  folder: 's2_aoi',
  fileNamePrefix: 'image_s2',
  region:aoi,
  //region: aoi.geometry(),
  scale: 10,
  crs: 'EPSG:4686',
  maxPixels: 1e13
});