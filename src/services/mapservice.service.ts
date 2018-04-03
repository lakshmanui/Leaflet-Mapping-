import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class MapService {

  constructor(public http:  Http) { }

  getRegionsData(params){
		return this.http.get('assets/us_org_' + params.usOrg + '_dsm.json')
                      .map((res:any) => res.json());
	}

  getNPSRegion(params){
		return this.http.get('assets/us_nps_region_' + params.year +  '_color.json')
                      .map((res:any) => res.json());
	}

}
