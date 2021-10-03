import React from 'react';
import { ImageDataCollection } from '../utils/markdown/hast2react';
import { ImageDataLike } from 'gatsby-plugin-image';

type ImageFromQL = {
  fields: {
    imagePath: string;
  };
  gatsbyImageData: ImageDataLike;
};
export type ImageDataFromQL = Array<ImageFromQL | undefined> | undefined;

export function useImageDataCollectionFromQL(imageData: ImageDataFromQL): ImageDataCollection {
  const imageDataCollection = React.useMemo<ImageDataCollection>(() => {
    const tmp_imageDataCollection: ImageDataCollection = {};
    imageData?.forEach((image) => {
      if (image != null) {
        tmp_imageDataCollection[image.fields.imagePath] = image.gatsbyImageData;
      }
    });
    return tmp_imageDataCollection;
  }, [imageData]);
  return imageDataCollection;
}
