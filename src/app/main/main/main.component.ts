import { Component, OnInit } from '@angular/core';
import { MainService } from '../service/main.service';
import { PodcastModel } from '../model/podcast.model';

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  public footerYear = "";

  public commonChartFeatures = {
    option: {
      responsive: true,
      scales: {
        yAxes: [{
          display: true,
          ticks: {
            beginAtZero: true,
            min: 0
          }
        }]
      }
    },
    legend: true,
    type: 'line'
  };

  public chartYearPodcast = {
    dataset: [{ data: [], label: 'Podcast Sayısı' }],
    label: [],
    option: this.commonChartFeatures.option,
    color: [{ backgroundColor: 'rgba(171,21,0,0.40)', borderColor: 'rgba(171,21,0,0.50)' }],
    legend: this.commonChartFeatures.legend,
    type: this.commonChartFeatures.type
  };

  public chartYearPodcastTime = {
    dataset: [{ data: [], label: 'Podcast Süresi (dk)' }],
    label: [],
    option: this.commonChartFeatures.option,
    color: [{ backgroundColor: 'rgba(90,150,10,0.40)', borderColor: 'rgba(90,150,10,0.50)' }],
    legend: this.commonChartFeatures.legend,
    type: this.commonChartFeatures.type
  };

  public chartPodcastTime = {
    dataset: [{ data: [], label: 'Podcast Süresi (dk)' }],
    label: [],
    option: this.commonChartFeatures.option,
    color: [{ backgroundColor: 'rgba(11,10,110,0.40)', borderColor: 'rgba(11,10,110,0.50)' }],
    legend: this.commonChartFeatures.legend,
    type: "bar"
  };

  public chartYearContent = {
    dataset: [{ data: [], label: 'Konu Sayısı' }],
    label: [],
    option: this.commonChartFeatures.option,
    color: [{ backgroundColor: 'rgba(171,210,0,0.40)', borderColor: 'rgba(171,210,0,0.50)' }],
    legend: this.commonChartFeatures.legend,
    type: this.commonChartFeatures.type
  };

  public chartYearLink = {
    dataset: [{ data: [], label: 'Link Sayısı' }],
    label: [],
    option: this.commonChartFeatures.option,
    color: [{ backgroundColor: 'rgba(17,21,0,0.40)', borderColor: 'rgba(17,21,0,0.50)' }],
    legend: this.commonChartFeatures.legend,
    type: this.commonChartFeatures.type
  };

  public chartYearVideo = {
    dataset: [{ data: [], label: 'Video Sayısı' }],
    label: [],
    option: this.commonChartFeatures.option,
    color: [{ backgroundColor: 'rgba(1,210,0,0.40)', borderColor: 'rgba(1,210,0,0.50)' }],
    legend: this.commonChartFeatures.legend,
    type: this.commonChartFeatures.type
  };

  public chartYearExplanation = {
    dataset: [{ data: [], label: 'Açıklama Sayısı' }],
    label: [],
    option: this.commonChartFeatures.option,
    color: [{ backgroundColor: 'rgba(17,17,200,0.40)', borderColor: 'rgba(17,17,200,0.50)' }],
    legend: this.commonChartFeatures.legend,
    type: this.commonChartFeatures.type
  };

  public podcastList: Array<PodcastModel> = new Array<PodcastModel>();

  public display = {
    isLoading: false,
    totalPodcast: 0,
    totalContent: 0,
    totalContentLink: 0,
    totalPodcastWithVideo: 0,
    totalPodcastNotWithVideo: 0,
    totalPodcastExplanation: 0,
    totalPodcastTime: "",
    maxTimePodcast: "",
    maxTimePodcastLink: "",
    minTimePodcast: "",
    minTimePodcastLink: "",
    avgTimePodcast: ""
  };

  constructor(
    private mainService: MainService
  ) { }

  ngOnInit(): void {
    this.updateAllData();

    this.footerYear = new Date().getFullYear().toString();
  }

  public updateAllData(): void {
    this.display.isLoading = true;
    this.mainService.GetData().subscribe(res => {
      this.podcastList = res["list"];

      this.display.totalPodcast = this.podcastList.length;

      this.display.totalContent = this.podcastList.map(x => x.content.length).reduce((a, b) => { return a + b });
      this.display.totalContentLink = this.podcastList.map(x => x.content.map(x => x.contentLink.length).reduce((a, b) => { return a + b })).reduce((a, b) => { return a + b });
      this.display.totalPodcastWithVideo = this.podcastList.filter(x => x.videoLink != "#").length;
      this.display.totalPodcastNotWithVideo = this.podcastList.filter(x => x.videoLink == "#").length;
      this.display.totalPodcastExplanation = this.podcastList.filter(x => x.explanationPodcast.length > 0).length;

      let totalTimeSeconds = this.podcastList.map(x => x.podcastTime).reduce((a, b) => { return a + b });
      let timeHour = Math.floor(totalTimeSeconds / 3600);
      let timeMinute = Math.floor((totalTimeSeconds % 3600) / 60);
      let timeSeconds = (totalTimeSeconds % 3600) % 60;
      this.display.totalPodcastTime = timeHour + " saat, " + timeMinute + " dakika, " + timeSeconds + " saniye";

      let maxTime = Math.max(...this.podcastList.map(x => x.podcastTime));
      let maxTimeObject = this.podcastList.filter(x => x.podcastTime == maxTime)[0];
      this.display.maxTimePodcast = maxTimeObject.year + "/" + maxTimeObject.count + " (" + this.timeFormat(maxTime) + ")";
      this.display.maxTimePodcastLink = maxTimeObject.podcastLink;

      let minTime = Math.min(...this.podcastList.map(x => x.podcastTime));
      let minTimeObject = this.podcastList.filter(x => x.podcastTime == minTime)[0];
      this.display.minTimePodcast = minTimeObject.year + "/" + minTimeObject.count + " (" + this.timeFormat(minTime) + ")";
      this.display.minTimePodcastLink = minTimeObject.podcastLink;

      this.display.avgTimePodcast = this.timeFormat(Math.floor((this.podcastList.map(x => x.podcastTime).reduce((a, b) => { return a + b })) / (this.podcastList.length))).toString();


      this.podcastList.forEach(element => {
        if (this.chartYearPodcast.label.filter(x => x == element.year).length < 1) {
          this.chartYearPodcast.label.push(element.year);
          this.chartYearPodcast.dataset[0].data.push(this.podcastList.filter(x => x.year == element.year).length);
        }
      });

      this.podcastList.forEach(element => {
        if (this.chartYearPodcastTime.label.filter(x => x == element.year).length < 1) {
          this.chartYearPodcastTime.label.push(element.year);
          this.chartYearPodcastTime.dataset[0].data.push(this.podcastList.filter(x => x.year == element.year).map(x => Math.floor(x.podcastTime / 60)).reduce((a, b) => { return a + b }));
        }
      });

      this.podcastList.forEach(element => {
        this.chartPodcastTime.label.push(element.totalCount + " - " + element.year + "/" + element.count);
        this.chartPodcastTime.dataset[0].data.push(Math.floor(element.podcastTime / 60));
      });

      this.podcastList.forEach(element => {
        if (this.chartYearContent.label.filter(x => x == element.year).length < 1) {
          this.chartYearContent.label.push(element.year);
          this.chartYearContent.dataset[0].data.push(this.podcastList.filter(x => x.year == element.year).map(x => x.content.length).reduce((a, b) => { return a + b }));
        }
      });

      this.podcastList.forEach(element => {
        if (this.chartYearLink.label.filter(x => x == element.year).length < 1) {
          this.chartYearLink.label.push(element.year);
          this.chartYearLink.dataset[0].data.push(this.podcastList.filter(x => x.year == element.year).map(x => x.content.map(x => x.contentLink.length).reduce((a, b) => { return a + b })).reduce((a, b) => { return a + b }));
        }
      });

      this.podcastList.forEach(element => {
        if (this.chartYearVideo.label.filter(x => x == element.year).length < 1) {
          this.chartYearVideo.label.push(element.year);
          this.chartYearVideo.dataset[0].data.push(this.podcastList.filter(x => x.year == element.year && x.videoLink != "#").length);
        }
      });

      this.podcastList.forEach(element => {
        if (this.chartYearExplanation.label.filter(x => x == element.year).length < 1) {
          this.chartYearExplanation.label.push(element.year);
          this.chartYearExplanation.dataset[0].data.push(this.podcastList.filter(x => x.year == element.year && x.explanationPodcast.length > 0).length);
        }
      });


      this.display.isLoading = false;
    });
  }

  public timeFormat(totalSeconds: number): string {
    let hour = Math.floor(totalSeconds / 3600);
    let minute = Math.floor((totalSeconds % 3600) / 60);
    let seconds = (totalSeconds % 3600) % 60;

    return hour + ":" + minute + ":" + seconds;
  }

}