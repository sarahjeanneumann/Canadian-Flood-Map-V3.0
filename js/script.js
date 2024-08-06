// Extract time range from the data and filter out features with null times
    function filterAndExtractTimeRange(data) {
        let filteredFeatures = data.features.filter(feature => {
            if (feature.properties.times !== null) {
                let date = new Date(feature.properties.times);
                if (!isNaN(date)) {
                    return true;
                } else {
                    console.warn('Invalid date:', feature.properties.times);
                    return false;
                }
            }
            return false;
        });
        data.features = filteredFeatures;
        let times = filteredFeatures.map(feature => new Date(feature.properties.times).getTime());
        if (times.length === 0) return null;
        times.sort((a, b) => a - b);
        return {
            start: new Date(times[0]).toISOString(),
            end: new Date(times[times.length - 1]).toISOString()
        };
    }

    // Filter and get time ranges for both datasets
    let noImpactTimeRange = filterAndExtractTimeRange(json_NoImpactScore_2);
    let impactTimeRange = filterAndExtractTimeRange(json_ImpactScore_3);

    // Determine overall time range
    let overallStart = noImpactTimeRange && impactTimeRange ? new Date(Math.min(new Date(noImpactTimeRange.start), new Date(impactTimeRange.start))).toISOString() : (noImpactTimeRange ? noImpactTimeRange.start : impactTimeRange.start);
    let overallEnd = noImpactTimeRange && impactTimeRange ? new Date(Math.max(new Date(noImpactTimeRange.end), new Date(impactTimeRange.end))).toISOString() : (noImpactTimeRange ? noImpactTimeRange.end : impactTimeRange.end);

    console.log("Time Dimension Start: ", overallStart);
    console.log("Time Dimension End: ", overallEnd);

    var map = L.map('map', {
        zoomControl: false, maxZoom: 28, minZoom: 1,
        timeDimension: true,
        timeDimensionOptions: {
            timeInterval: overallStart + "/" + overallEnd,
            period: "P1Y"
        },
        timeDimensionControl: true,
        timeDimensionControlOptions: {
            position: 'bottomleft',
            autoPlay: true,
            loopButton: true,
            playButton: true,
            minSpeed: 1,
            speedStep: 1,
            maxSpeed: 10,
            timeSliderDragUpdate: true
        }
    });

    var hash = new L.Hash(map);
    map.attributionControl.setPrefix('<a href="https://github.com/tomchadwin/qgis2web" target="_blank">qgis2web</a> &middot; <a href="https://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> &middot; <a href="https://qgis.org">QGIS</a>');
    var autolinker = new Autolinker({truncate: {length: 30, location: 'smart'}});

    // remove popup's row if "visible-with-data"
    function removeEmptyRowsFromPopupContent(content, feature) {
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        var rows = tempDiv.querySelectorAll('tr');
        for (var i = 0; i < rows.length; i++) {
            var td = rows[i].querySelector('td.visible-with-data');
            var key = td ? td.id : '';
            if (td && td.classList.contains('visible-with-data') && feature.properties[key] == null) {
                rows[i].parentNode.removeChild(rows[i]);
            }
        }
        return tempDiv.innerHTML;
    }
    // add class to format popup if it contains media
    function addClassToPopupIfMedia(content, popup) {
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        if (tempDiv.querySelector('td img')) {
            popup._contentNode.classList.add('media');
                // Delay to force the redraw
                setTimeout(function() {
                    popup.update();
                }, 10);
        } else {
            popup._contentNode.classList.remove('media');
        }
    }

    var zoomControl = L.control.zoom({
        position: 'topleft'
    }).addTo(map);
    L.control.locate({locateOptions: {maxZoom: 19}}).addTo(map);
    var measureControl = new L.Control.Measure({
        position: 'topleft',
        primaryLengthUnit: 'meters',
        secondaryLengthUnit: 'kilometers',
        primaryAreaUnit: 'sqmeters',
        secondaryAreaUnit: 'hectares'
    });
    measureControl.addTo(map);
    document.getElementsByClassName('leaflet-control-measure-toggle')[0].innerHTML = '';
    document.getElementsByClassName('leaflet-control-measure-toggle')[0].className += ' fas fa-ruler';
    var bounds_group = new L.featureGroup([]);
    function setBounds() {
        if (bounds_group.getLayers().length) {
            map.fitBounds(bounds_group.getBounds());
        }
        map.setMaxBounds(map.getBounds());
    }
    map.createPane('pane_OpenStreetMap_0');
    map.getPane('pane_OpenStreetMap_0').style.zIndex = 400;
    var layer_OpenStreetMap_0 = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        pane: 'pane_OpenStreetMap_0',
        opacity: 1.0,
        attribution: '',
        minZoom: 1,
        maxZoom: 28,
        minNativeZoom: 0,
        maxNativeZoom: 19
    });
    map.addLayer(layer_OpenStreetMap_0);

    function pop_CanadaSubSubBasins_1(feature, layer) {
        var popupContent = '<table>\
                <tr>\
                    <td colspan="2">' + (feature.properties['OID'] !== null ? autolinker.link(feature.properties['OID'].toLocaleString()) : '') + '</td>\
                </tr>\
                <tr>\
                    <td colspan="2">' + (feature.properties['Name'] !== null ? autolinker.link(feature.properties['Name'].toLocaleString()) : '') + '</td>\
                </tr>\
                <tr>\
                    <td colspan="2">' + (feature.properties['FolderPath'] !== null ? autolinker.link(feature.properties['FolderPath'].toLocaleString()) : '') + '</td>\
                </tr>\
                <tr>\
                    <td colspan="2">' + (feature.properties['SymbolID'] !== null ? autolinker.link(feature.properties['SymbolID'].toLocaleString()) : '') + '</td>\
                </tr>\
                <tr>\
                    <td colspan="2">' + (feature.properties['AltMode'] !== null ? autolinker.link(feature.properties['AltMode'].toLocaleString()) : '') + '</td>\
                </tr>\
                <tr>\
                    <td colspan="2">' + (feature.properties['Base'] !== null ? autolinker.link(feature.properties['Base'].toLocaleString()) : '') + '</td>\
                </tr>\
                <tr>\
                    <td colspan="2">' + (feature.properties['Clamped'] !== null ? autolinker.link(feature.properties['Clamped'].toLocaleString()) : '') + '</td>\
                </tr>\
                <tr>\
                    <td colspan="2">' + (feature.properties['Extruded'] !== null ? autolinker.link(feature.properties['Extruded'].toLocaleString()) : '') + '</td>\
                </tr>\
                <tr>\
                    <td colspan="2">' + (feature.properties['Snippet'] !== null ? autolinker.link(feature.properties['Snippet'].toLocaleString()) : '') + '</td>\
                </tr>\
                <tr>\
                    <td colspan="2">' + (feature.properties['PopupInfo'] !== null ? autolinker.link(feature.properties['PopupInfo'].toLocaleString()) : '') + '</td>\
                </tr>\
                <tr>\
                    <td colspan="2">' + (feature.properties['Shape_Length'] !== null ? autolinker.link(feature.properties['Shape_Length'].toLocaleString()) : '') + '</td>\
                </tr>\
                <tr>\
                    <td colspan="2">' + (feature.properties['Shape_Area'] !== null ? autolinker.link(feature.properties['Shape_Area'].toLocaleString()) : '') + '</td>\
                </tr>\
            </table>';
        var content = removeEmptyRowsFromPopupContent(popupContent, feature);
        layer.on('popupopen', function(e) {
            addClassToPopupIfMedia(content, e.popup);
        });
        layer.bindPopup(content, { maxHeight: 400 });
    }

    function style_CanadaSubSubBasins_1_0() {
        return {
            pane: 'pane_CanadaSubSubBasins_1',
            opacity: 1,
            color: 'rgba(35,35,35,0.39215686274509803)',
            dashArray: '',
            lineCap: 'butt',
            lineJoin: 'miter',
            weight: 1.0, 
            fill: true,
            fillOpacity: 1,
            fillColor: 'rgba(176,155,130,0.3607843137254902)',
            interactive: false,
        }
    }
    map.createPane('pane_CanadaSubSubBasins_1');
    map.getPane('pane_CanadaSubSubBasins_1').style.zIndex = 401;
    map.getPane('pane_CanadaSubSubBasins_1').style['mix-blend-mode'] = 'normal';
    var layer_CanadaSubSubBasins_1 = new L.geoJson(json_CanadaSubSubBasins_1, {
        attribution: '',
        interactive: false,
        dataVar: 'json_CanadaSubSubBasins_1',
        layerName: 'layer_CanadaSubSubBasins_1',
        pane: 'pane_CanadaSubSubBasins_1',
        onEachFeature: pop_CanadaSubSubBasins_1,
        style: style_CanadaSubSubBasins_1_0,
    });
    bounds_group.addLayer(layer_CanadaSubSubBasins_1);
    map.addLayer(layer_CanadaSubSubBasins_1);

    function pop_NoImpactScore_2(feature, layer) {
        var popupContent = '<table>\
                <tr>\
                    <th scope="row">Impacted Regions</th>\
                    <td>' + (feature.properties['impacted_regions_name'] !== null ? autolinker.link(feature.properties['impacted_regions_name'].toLocaleString()) : '') + '</td>\
                </tr>\
                <tr>\
                    <th scope="row">Sub-Sub Basin ID</th>\
                    <td class="visible-with-data" id="name">' + (feature.properties['name'] !== null ? autolinker.link(feature.properties['name'].toLocaleString()) : '') + '</td>\
                </tr>\
                <tr>\
                    <th scope="row">Dates</th>\
                    <td>' + (feature.properties['impacted_regions_date'] !== null ? autolinker.link(feature.properties['impacted_regions_date'].toLocaleString()) : '') + '</td>\
                </tr>\
                </table>';
        var content = removeEmptyRowsFromPopupContent(popupContent, feature);
        layer.on('popupopen', function(e) {
            addClassToPopupIfMedia(content, e.popup);
        });
        layer.bindPopup(content, { maxHeight: 400 });
    }

    function style_NoImpactScore_2_0(feature) {
        return {
            pane: 'pane_NoImpactScore_2',
            opacity: 1,
            color: 'rgba(35,35,35,1.0)',
            dashArray: '',
            lineCap: 'butt',
            lineJoin: 'miter',
            weight: 1.0, 
            fill: true,
            fillOpacity: 1,
            fillColor: 'rgba(150,150,150,1.0)',
            interactive: true,
        }
    }
    map.createPane('pane_NoImpactScore_2');
    map.getPane('pane_NoImpactScore_2').style.zIndex = 402;
    map.getPane('pane_NoImpactScore_2').style['mix-blend-mode'] = 'normal';
    var layer_NoImpactScore_2 = new L.geoJson(json_NoImpactScore_2, {
        attribution: '',
        interactive: true,
        dataVar: 'json_NoImpactScore_2',
        layerName: 'layer_NoImpactScore_2',
        pane: 'pane_NoImpactScore_2',
        onEachFeature: pop_NoImpactScore_2,
        style: style_NoImpactScore_2_0,
    });
    var tdLayer_NoImpactScore_2 = L.timeDimension.layer.geoJson(layer_NoImpactScore_2, {
        updateTimeDimension: true,
        updateTimeDimensionMode: 'union',
        duration: 'P1Y',
        addlastPoint: true,
        waitForReady: true
    });
    bounds_group.addLayer(tdLayer_NoImpactScore_2);
    tdLayer_NoImpactScore_2.addTo(map);

    function pop_ImpactScore_3(feature, layer) {
        var popupContent = '<table>\
                <tr>\
                    <th scope="row">Sub-Sub Basin ID</th>\
                    <td class="visible-with-data" id="name">' + (feature.properties['name'] !== null ? autolinker.link(feature.properties['name'].toLocaleString()) : '') + '</td>\
                </tr>\
                <tr>\
                    <th scope="row">Impact Score</th>\
                    <td>' + (feature.properties['impacted_regions_impact_score'] !== null ? autolinker.link(feature.properties['impacted_regions_impact_score'].toLocaleString()) : '') + '</td>\
                </tr>\
                <tr>\
                    <th scope="row">Impacted Regions</th>\
                    <td>' + (feature.properties['impacted_regions_name'] !== null ? autolinker.link(feature.properties['impacted_regions_name'].toLocaleString()) : '') + '</td>\
                </tr>\
                <tr>\
                    <th scope="row">Date</th>\
                    <td>' + (feature.properties['impacted_regions_date'] !== null ? autolinker.link(feature.properties['impacted_regions_date'].toLocaleString()) : '') + '</td>\
            </table>';
        var content = removeEmptyRowsFromPopupContent(popupContent, feature);
        layer.on('popupopen', function(e) {
            addClassToPopupIfMedia(content, e.popup);
        });
        layer.bindPopup(content, { maxHeight: 400 });
    }

    function style_ImpactScore_3_0(feature) {
        switch(String(feature.properties['impacted_regions_impact_score'])) {
            case '8':
                return {
            pane: 'pane_ImpactScore_3',
            opacity: 1,
            color: 'rgba(35,35,35,1.0)',
            dashArray: '',
            lineCap: 'butt',
            lineJoin: 'miter',
            weight: 1.0, 
            fill: true,
            fillOpacity: 1,
            fillColor: 'rgba(247,251,255,1.0)',
            interactive: true,
        }
                break;
            case '21':
                return {
            pane: 'pane_ImpactScore_3',
            opacity: 1,
            color: 'rgba(35,35,35,1.0)',
            dashArray: '',
            lineCap: 'butt',
            lineJoin: 'miter',
            weight: 1.0, 
            fill: true,
            fillOpacity: 1,
            fillColor: 'rgba(200,220,240,1.0)',
            interactive: true,
        }
                break;
            case '25':
                return {
            pane: 'pane_ImpactScore_3',
            opacity: 1,
            color: 'rgba(35,35,35,1.0)',
            dashArray: '',
            lineCap: 'butt',
            lineJoin: 'miter',
            weight: 1.0, 
            fill: true,
            fillOpacity: 1,
            fillColor: 'rgba(115,178,216,1.0)',
            interactive: true,
        }
                break;
            case '29':
                return {
            pane: 'pane_ImpactScore_3',
            opacity: 1,
            color: 'rgba(35,35,35,1.0)',
            dashArray: '',
            lineCap: 'butt',
            lineJoin: 'miter',
            weight: 1.0, 
            fill: true,
            fillOpacity: 1,
            fillColor: 'rgba(41,121,185,1.0)',
            interactive: true,
        }
                break;
            default:
                return {
            pane: 'pane_ImpactScore_3',
            opacity: 1,
            color: 'rgba(35,35,35,0.0)',
            dashArray: '',
            lineCap: 'butt',
            lineJoin: 'miter',
            weight: 1.0, 
            fill: true,
            fillOpacity: 1,
            fillColor: 'rgba(231,113,72,0.0)',
            interactive: true,
        }
                break;
        }
    }
    map.createPane('pane_ImpactScore_3');
    map.getPane('pane_ImpactScore_3').style.zIndex = 403;
    map.getPane('pane_ImpactScore_3').style['mix-blend-mode'] = 'normal';
    var layer_ImpactScore_3 = new L.geoJson(json_ImpactScore_3, {
        attribution: '',
        interactive: true,
        dataVar: 'json_ImpactScore_3',
        layerName: 'layer_ImpactScore_3',
        pane: 'pane_ImpactScore_3',
        onEachFeature: pop_ImpactScore_3,
        style: style_ImpactScore_3_0,
    });
    var tdLayer_ImpactScore_3 = L.timeDimension.layer.geoJson(layer_ImpactScore_3, {
        updateTimeDimension: true,
        updateTimeDimensionMode: 'union',
        duration: 'P1Y',
        addlastPoint: true,
        waitForReady: true
    });
    bounds_group.addLayer(tdLayer_ImpactScore_3);
    tdLayer_ImpactScore_3.addTo(map);

    setBounds();