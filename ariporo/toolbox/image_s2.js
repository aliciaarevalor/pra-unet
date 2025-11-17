var s2a=ee.ImageCollection('COPERNICUS/S2_SR')
          .filterBounds(aoi)
          .filterDate('2021-01-01','2021-12-31')
          .select('B2','B3','B4','B5')
          .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))

var image=s2a.sort('CLOUDY_PIXEL_PERCENTAGE').first();

// Print image
print(image);
// Print aoi CRS
print(aoi.first().geometry().projection());

// Reproject to EPSG:32630
var aoi_utm = aoi.first().geometry().transform('EPSG:32630', 1);

// Visualization in RGB
var visualize = {
  bands: ['B4', 'B3', 'B2'],
  min: 0,
  max: 3000,
  gamma: 1.4
};

// Center and add layer
Map.addLayer(aoi, {}, 'aoi');
Map.centerObject(image, 10);
Map.addLayer(image, visualize, 'image_s2');

// Export to Google Drive
Export.image.toDrive({
  image: image,
  description: 'image_s2',
  folder: 's2_aoi',
  fileNamePrefix: 'image_s2',
  region: aoi_utm,
  scale: 10,
  crs: 'EPSG:32630',
  maxPixels: 1e13
});