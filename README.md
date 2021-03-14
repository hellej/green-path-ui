[![tests & deploy status](https://github.com/DigitalGeographyLab/hope-green-path-ui/workflows/Tests%20%26%20Deploy/badge.svg)](https://github.com/DigitalGeographyLab/hope-green-path-ui/actions)

# Green paths UI

A user interface for [the green path route optimization application](https://github.com/DigitalGeographyLab/hope-green-path-server/) being developed for [UIA HOPE project](https://ilmanlaatu.eu/briefly-in-english/) – Healthy Outdoor Premises for Everyone.

Its goal is to inform people on clean routes for walking and cycling in Helsinki region. It utilizes Air Quality Index (AQI) from the Enfuser model (by the Finnish Meteorological Institute) and modelled traffic noise data. AQI is based on hourly updated and combined information on NO2, PM2.5, PM10 and O3.

Currently implemented features include calculation of walkable quiet paths with respect to typical daily traffic noise levels. The exposure-based routing application and user interface are based on [an MSc thesis](https://github.com/hellej/quiet-paths-msc). 

Live demo: [green-paths.web.app](https://green-paths.web.app/)

## Related projects
- [hope-green-path-server](https://github.com/DigitalGeographyLab/hope-green-path-server)
- [hope-graph-updater](https://github.com/DigitalGeographyLab/hope-graph-updater)
- [hope-graph-builder](https://github.com/DigitalGeographyLab/hope-graph-builder)

## Materials
* [Green Paths project website](https://www.helsinki.fi/en/researchgroups/digital-geography-lab/green-paths)
* [UIA HOPE project](https://ilmanlaatu.eu/briefly-in-english/)
* [FMI Enfuser model](https://en.ilmatieteenlaitos.fi/environmental-information-fusion-service)
* [SYKE - Traffic noise data in Helsinki urban region 2017](https://www.syke.fi/en-US/Open_information/Spatial_datasets/Downloadable_spatial_dataset#E)
* [Traffic noise zones in Helsinki 2017](https://hri.fi/data/en_GB/dataset/helsingin-kaupungin-meluselvitys-2017)
* [OpenStreetMap](https://www.openstreetmap.org/about/)

## Built with
* React, Redux & Thunk
* Mapbox GL JS & Turf.js
* TypeScript

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

## License
[MIT](LICENSE)
