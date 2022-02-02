import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';

import { BackendService } from '@core/services/backend.service';
import { LoggerService } from '@core/services/logger.service';

import { faRedoAlt } from '@fortawesome/free-solid-svg-icons';

import { Observable, Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;

  private updateSubscription: Subscription = new Subscription();

  refreshIcon = faRedoAlt;
  currentMarkerDescription = '';

  zoom = 12;
  options: google.maps.MapOptions = {
    mapTypeId: 'terrain',
    center: { lat: 61.4954148, lng: 23.7999618 },
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    maxZoom: 15,
    minZoom: 8,
  };
  markerOptions: google.maps.MarkerOptions = {
    icon: 'assets/bus-map-icon.png',
    clickable: true,
    draggable: false,
  };
  markerPositions: any[] = [];

  constructor(private logger: LoggerService, private http: BackendService) {}

  ngOnInit(): void {
    this.updateAllVehicleLocations();

    this.updateSubscription = interval(5000).subscribe(() => this.updateAllVehicleLocations());
  }

  private convertVehicleLocationsToGoogleMapsModel(allVehicleData: any[]): any[] {
    const returnArray: any[] = [];

    allVehicleData.forEach((vehicleData) => {
      returnArray.push({
        lat: Number.parseFloat(vehicleData.vehicleLocation.latitude),
        lng: Number.parseFloat(vehicleData.vehicleLocation.longitude),
        description: `Line: ${vehicleData.lineRef}, Journey: ${vehicleData.journeyPatternRef}`,
      });
    });

    return returnArray;
  }

  updateAllVehicleLocations(): void {
    this.http.get('http://data.itsfactory.fi/journeys/api/1/vehicle-activity').subscribe((data) => {
      this.logger.info('Start data: ', data);
      // monitoredVehicleJourney.vehicleLocation.latitude .longitude
      const allVehicleData = Array.from(data.body).flatMap(
        (item: any) => item['monitoredVehicleJourney']
      );
      this.logger.info('allVehicleData: ', allVehicleData);

      const allGoogleMapsLatLngLiterals =
        this.convertVehicleLocationsToGoogleMapsModel(allVehicleData);
      this.logger.info('allGoogleMapsLatLngLiterals: ', allGoogleMapsLatLngLiterals);

      this.markerPositions = allGoogleMapsLatLngLiterals;
    });
  }

  openInfoWindow(marker: MapMarker, markerPosition: any) {
    this.currentMarkerDescription = markerPosition.description;
    this.infoWindow.open(marker);
  }

  ngOnDestroy(): void {
    this.updateSubscription.unsubscribe();
  }
}
