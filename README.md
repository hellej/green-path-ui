[![tests & deploy status](https://github.com/DigitalGeographyLab/hope-green-path-ui/workflows/Tests%20%26%20Deploy/badge.svg)](https://github.com/DigitalGeographyLab/hope-green-path-ui/actions)

# Green paths UI

A user interface for the [Green Paths](https://github.com/DigitalGeographyLab/hope-green-path-server/) route planner being developed within [UIA HOPE project](https://ilmanlaatu.eu/briefly-in-english/) – Healthy Outdoor Premises for Everyone. Its goal is to help people find routes of fresh air, less noise and more greenery for walking and cycling in the Helsinki capital region.

The route planner utilizes air quality index (AQI) data from the [FMI-ENFUSER](https://en.ilmatieteenlaitos.fi/environmental-information-fusion-service) modeling system (by the Finnish Meteorological Institute) and modeled [traffic noise data](www.syke.fi/en-US/Open_information/Spatial_datasets/Downloadable_spatial_dataset#E) from the Helsinki capital region. AQI is based on real-time hourly data as a composite measure of NO2, PM2.5, PM10, SO2 and O3. Green view (i.e. greenery) data is derived from [analyzing Google Street View images](https://www.sciencedirect.com/science/article/pii/S2352340920304959?via%3Dihub) and openly available [land cover data by HRI](https://hri.fi/data/en_GB/dataset/paakaupunkiseudun-maanpeiteaineisto). 

Currently implemented features include calculation of unpolluted, green and quiet paths for walking or cycling (separately) with respect to real-time air quality, street level green view index and typical (day-evening-night) noise levels from road and rail traffic. The exposure-based routing method (and application) is based on [an MSc thesis](https://github.com/hellej/quiet-paths-msc). 

Live demo: [green-paths.web.app](https://green-paths.web.app/)

## Related projects
- [hope-green-path-server](https://github.com/DigitalGeographyLab/hope-green-path-server)
- [hope-graph-builder](https://github.com/DigitalGeographyLab/hope-graph-builder)

## Materials
* [OpenStreetMap](https://www.openstreetmap.org/about/) 
* [FMI-Enfuser modeling system](https://en.ilmatieteenlaitos.fi/environmental-information-fusion-service)
* [SYKE - Traffic noise modeling data from Helsinki urban region](https://www.syke.fi/en-US/Open_information/Spatial_datasets/Downloadable_spatial_dataset#E)
* [Traffic noise zones in Helsinki 2017](https://hri.fi/data/en_GB/dataset/helsingin-kaupungin-meluselvitys-2017)
* [Street-level green view index by Google Street View images](https://www.sciencedirect.com/science/article/pii/S2352340920304959?via%3Dihub)
* [Land cover data (low & high vegetation)](https://hri.fi/data/en_GB/dataset/paakaupunkiseudun-maanpeiteaineisto)

## Built with
* React, Redux & Thunk
* TypeScript
* Mapbox GL JS & Turf.js

## Contributing
* See also [CONTRIBUTING.md](CONTRIBUTING.md)
* Please bear in mind that the current objective of the project is to develop a proof-of-concept of a green path route planner rather than a production ready service
* You are most welcome to add feature requests or bug reports in the issue tracker
* When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change (firstname.lastname@helsinki.fi)
* Simple typo fixes etc. can be sent as PRs directly, but for features or more complex bug fixes please add a corresponding issue first for discussion

## Installation
```
$ git clone git@github.com:DigitalGeographyLab/hope-green-path-ui.git
$ cd hope-green-path-ui
$ npm install
$ npm start
```
Create file `.env` and add your Mapbox access token to it as `REACT_APP_MB_ACCESS=`<br>
Open browser to http://localhost:3000/

## Integration tests
```
$ npm run cypress
```

## Links
* [Green Paths project website](https://www.helsinki.fi/en/researchgroups/digital-geography-lab/green-paths)
* [UIA HOPE project](https://ilmanlaatu.eu/briefly-in-english/)

## License
[MIT](LICENSE)
