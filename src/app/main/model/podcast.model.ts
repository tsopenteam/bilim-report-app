import { ContentModel } from './content.model';

export class PodcastModel {
    year: string;
    count: number;
    totalCount: number;
    uploadDate: string;
    podcastLink: string;
    videoLink: string;
    siteLink: string;
    podcastTime: number;
    titlePodcast: string;
    explanationPodcast: string;
    content: Array<ContentModel>;

    constructor() {
        this.content = new Array<ContentModel>();
    }
}