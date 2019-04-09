import { DataTranslator } from './DataTranslator';


export class FrameImage extends DataTranslator {
     downloadPath: string;
     imageId: string;
     ownerId: string;
     constructor(downloadPath: string, imageId: string, ownerId: string) {
         super();
         this.downloadPath = downloadPath;
         this.imageId = imageId;
         this.ownerId = ownerId;
     }
}

