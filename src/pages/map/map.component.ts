import { MapService } from './../../services/mapservice.service';

import { Component, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  public map: any;
  public mapboxAccessToken = 'pk.eyJ1IjoiYW5pbHBhdGh1cmkiLCJhIjoiY2oybDhmcWF0MDAwMDJxcWtzMDgwZWI3cyJ9.hzryXsu_ec_AafR-QzzVUQ';
  public npsRegions: any = {};
  public regionsData: any = {};
  public ctx: CanvasRenderingContext2D;
  public regionsList: any = [];
  public brandNames: any = [];
  public yearsList: any = [];
  public selectedRegion = '';
  public selectedYear = '';
  public selectedBrand = '';
  public isNpsRegions = false;
  public npsObject: any = {};
  public isCanvas = false;
  public selectedTab = '';

  @ViewChild('myCanvas') myCanvas;

  constructor(public mapService: MapService) { }

  ngOnInit() {
    this.mapInitialization();
    this.regionsList = ['National'];
    this.yearsList = ['2016-15'];
    this.brandNames = ['x'];
  }
  mapInitialization() {
    this.map = L.map('map') .setView([37.8, -96], 4);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + this.mapboxAccessToken, {
      id: 'mapbox.light',
      attribution: ''
    }).addTo(this.map);
  }

  canvasInitialization() {
    this.isCanvas = true;
    const canvasEl: HTMLCanvasElement = this.myCanvas.nativeElement;
    const ctx = canvasEl.getContext('2d');
    const my_gradient = ctx.createLinearGradient(0, 0, 285, 0);
    my_gradient.addColorStop(0, '#f29492');
    my_gradient.addColorStop(0.25, '#f9d4d3');
    my_gradient.addColorStop(0.5, '#f5f5f5');
    my_gradient.addColorStop(0.75, '#a4d3ed');
    my_gradient.addColorStop(1, '#1c92d2');
    ctx.fillStyle = my_gradient;
    ctx.fillRect(20, 20, 250, 25);
  }

  countieStyle(feature) {
    return {
      weight: 0.3
    };
  }

  yearCountieStyle(feature) {
    if (feature.isNpsRegion) {
      const npsValue = {};
      let diff = 0;
      npsValue['2016'] = feature.npsRegion['2016'] || {};
      npsValue['2015'] = feature.npsRegion['2015'] || {};
      npsValue['2014'] = feature.npsRegion['2014'] || {};
      if ( (npsValue['2016'].NPS || npsValue['2016'].NPS === 0.0) && (npsValue['2015'].NPS || npsValue['2015'].NPS === 0.0) && feature.selecredYear.indexOf('2016') !== -1) {
        diff = npsValue['2016'].NPS - npsValue['2015'].NPS;
      } else if ((npsValue['2016'].NPS || npsValue['2016'].NPS === 0.0) && feature.selecredYear.indexOf('2016') !== -1) {
        diff = npsValue['2016'].NPS;
      } else if ( (npsValue['2015'].NPS || npsValue['2015'].NPS === 0.0) && (npsValue['2014'].NPS || npsValue['2014'].NPS === 0.0) && feature.selecredYear.indexOf('2015') !== -1) {
        diff = npsValue['2015'].NPS - npsValue['2014'].NPS;
      } else {
         diff = npsValue['2015'].NPS;
      }

        const styleObj =  {
        fillColor: diff > 45 ? '#f29492' :
                    diff > 25 ? '#f4a9a7' :
                      diff > 5 ? '#f9d4d3' :
                        diff > -5 ? '#a4d3ed' :
                          diff > -25 ? '#49a7db' :
                            diff > -45  ? '#1c92d2' :
                              diff === undefined ? '#000000' :
                                '#f5f5f5',
        weight: 0,
        fillOpacity: 0.7
      };
      return styleObj;
    } else {
      const styleObj = {
        // weight:0.3
        weight: 0,
        fillColor: '#000000',
        fillOpacity: 0.8
      };
      return styleObj;
    }
  }

  onEachFeature(feature, layer) {
    const npsValue = {};
    npsValue['2016'] = feature.npsRegion['2016'] || {};
    npsValue['2015'] = feature.npsRegion['2015'] || {};
    npsValue['2014'] = feature.npsRegion['2014'] || {};

    if ( (npsValue['2016'].NPS || npsValue['2016'].NPS === 0.0) && (npsValue['2015'].NPS || npsValue['2015'].NPS === 0.0) && feature.selecredYear.indexOf('2016') != -1) {
      npsValue['2016'].NPS = Math.round(npsValue['2016'].NPS);
      npsValue['2015'].NPS = Math.round(npsValue['2015'].NPS);
      let diff: any = npsValue['2016'].NPS - npsValue['2015'].NPS;
          diff = Math.round(diff);
      let icon = '';
      if (diff > 0) {
        icon = 'glyphicon-arrow-up color-blue';
      } else {
        icon = 'glyphicon-arrow-down color-red';
      }
      layer.bindPopup(`<div>
          <h4 class="set-margincls">${feature.properties.dsm_id}</h4>
          <table class="table table-hover">
            <thead>
              <tr>
                <th></th>
                <th>NPS</th>
                <th>NUMBERS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2016</td>
                <td>${npsValue['2016'].NPS}</td>
                <td>${npsValue['2016'].N}</td>
              </tr>
              <tr>
                <td>2015</td>
                <td>${npsValue['2015'].NPS}</td>
                <td>${npsValue['2015'].N}</td>
              </tr>
              <tr>
                <td>Diff</td>
                <td colspan="2">${diff} <span class="glyphicon  ${icon} "></td>
              </tr>
            </tbody>
          </table>
        </div>
      `);
    } else if ( (npsValue['2016'].NPS || npsValue['2016'].NPS === 0.0) && feature.selecredYear.indexOf('2016') !== -1) {
      npsValue['2016'].NPS = Math.round(npsValue['2016'].NPS);
      layer.bindPopup(`<div>
          <h4 class="set-margincls">${feature.properties.dsm_id}</h4>
          <table class="table table-hover">
            <thead>
              <tr>
                <th></th>
                <th>NPS</th>
                <th>NUMBERS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2016</td>
                <td>${npsValue['2016'].NPS}</td>
                <td>${npsValue['2016'].N}</td>
              </tr>
            </tbody>
          </table>
        </div>
      `);
    } else if ( (npsValue['2015'].NPS || npsValue['2015'].NPS === 0.0) && (npsValue['2014'].NPS || npsValue['2014'].NPS === 0.0) && feature.selecredYear.indexOf('2015') !== -1) {
      npsValue['2014'].NPS = Math.round(npsValue['2014'].NPS);
      npsValue['2015'].NPS = Math.round(npsValue['2015'].NPS);
      let diff: any = npsValue['2015'].NPS - npsValue['2014'].NPS;
           diff = Math.round(diff);
      let icon = '';
      if (diff > 0) {
        icon = 'glyphicon-arrow-up color-blue';
      } else {
        icon = 'glyphicon-arrow-down color-red';
      }

      layer.bindPopup(`<div>
          <h4 class="set-margincls">${feature.properties.dsm_id}</h4>
          <table class="table table-hover">
            <thead>
              <tr>
                <th></th>
                <th>NPS</th>
                <th>NUMBERS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2015</td>
                <td>${npsValue['2015'].NPS}</td>
                <td>${npsValue['2015'].N}</td>
              </tr>
              <tr>
                <td>2014</td>
                <td>${npsValue['2014'].NPS}</td>
                <td>${npsValue['2014'].N}</td>
              </tr>
              <tr>
                <td>Diff</td>
                <td colspan="2">${diff} <span class="glyphicon  ${icon} "></td>
              </tr>
            </tbody>
          </table>
        </div>
      `);
    } else if ( (npsValue['2015'].NPS || npsValue['2015'].NPS === 0.0) && feature.selecredYear.indexOf('2015') !== -1) {
      npsValue['2015'].NPS = Math.round(npsValue['2015'].NPS);
      layer.bindPopup(`<div>
          <h4 class="set-margincls">${feature.properties.dsm_id}</h4>
          <table class="table table-hover">
            <thead>
              <tr>
                <th></th>
                <th>NPS</th>
                <th>NUMBERS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2015</td>
                <td>${npsValue['2015'].NPS}</td>
                <td>${npsValue['2015'].N}</td>
              </tr>
            </tbody>
          </table>
        </div>
      `);
    } else {
      layer.bindPopup('<div class="info-div"> <b>' + feature.properties.dsm_id + '</b> </div>');
    }
    layer.on('mouseover', function (e) {
      layer.openPopup(e.latlng);
    });
    layer.on('mouseout', function () {
      layer.closePopup();
    });
  }


  regionChange(selectedRegion) {
    this.selectedRegion = selectedRegion;
    this.selectedYear = '';
    this.selectedTab = '';
    this.selectedBrand = '';
    this.isCanvas = false;
    let url = this.selectedRegion.toLocaleLowerCase() || '';
    if (url === 'region') {
      url = 'regional';
    }
    const params = {
      'usOrg': url
    };
    this.mapService.getRegionsData(params)
      .subscribe(
        data => {
          this.map.remove();
          this.mapInitialization();
          this.regionsData = data || {};
          L.geoJSON(this.regionsData,  { style: this.countieStyle}).addTo(this.map);
        },
        error => {
          console.log(error);
        }
      );

  }

  brandChange(brandName) {
    this.selectedBrand = brandName || '';
    this.selectedYear = '';
    this.selectedTab = '';
  }

  yearChange(selectedYear) {
    this.selectedYear = selectedYear;
    this.selectedTab = '';
    const params = {
      'year': this.selectedYear || ''
    };
    this.mapService.getNPSRegion(params)
      .subscribe(
        data => {
          this.map.remove();
          this.mapInitialization();
          this.npsRegions = data || {};
          this.isCanvas = false;
          this.npsObject = {};
          for (const i in this.regionsData.features) {
            const feature: any = this.regionsData.features[i] || {};
            const properties = feature.properties || {};
            let npsRegion;
            if (this.selectedRegion === 'Region') {
              npsRegion = this.npsRegions[properties.terrid] || {};
              this.regionsData.features[i].properties.dsm_id = properties.terrid;
            } else {
              npsRegion = this.npsRegions[properties.dsm_id] || {};
              console.log(npsRegion);
            }
            if (npsRegion.change) {
              this.regionsData.features[i].npsRegion = npsRegion || {};
              this.regionsData.features[i].isNpsRegion = true;
            } else {
              this.regionsData.features[i].npsRegion = {};
              this.regionsData.features[i].isNpsRegion = false;
              this.regionsData.features[i].npsRegion['2016'] = {'Q1': {}, 'Q2': {}, 'Q3': {}, 'Q4': {}};
              this.regionsData.features[i].npsRegion['2015'] = {'Q1': {}, 'Q2': {}, 'Q3': {}, 'Q4': {}};
              this.regionsData.features[i].npsRegion['2014'] = {'Q1': {}, 'Q2': {}, 'Q3': {}, 'Q4': {}};
            }
            this.regionsData.features[i].selecredYear = this.selectedYear;
          }

          let NPSValues = this.regionsData.features.map(function(o) {return o.npsRegion.change; });
          NPSValues = NPSValues.filter((NPS) => NPS !== undefined);
          if (NPSValues.length > 0) {
            const max = Math.max.apply(Math, NPSValues);
            this.npsObject.maxNPS = Math.round(max) || '';
          }
          NPSValues = this.regionsData.features.map(function(o) {return o.npsRegion.change; });
          NPSValues = NPSValues.filter((NPS) => NPS !== undefined);
          if (NPSValues.length > 0) {
            const min = Math.min.apply(Math, NPSValues);
            this.npsObject.minNPS = Math.round(min) || '';
          }
          if (this.npsObject.maxNPS && this.npsObject.minNPS) {
            this.canvasInitialization();
          }
          L.geoJSON(this.regionsData, { style: this.yearCountieStyle, onEachFeature : this.onEachFeature}).addTo(this.map);
        },
        error => {
          console.log(error);
        }
      );
  }

}

