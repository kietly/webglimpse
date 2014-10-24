/*
 * Copyright (c) 2014, Metron, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
module Webglimpse {

    export interface TimelineTimeseries {
        timeseriesGuid : string;
        // supported hints:
        // lines, points, lines-and-points, bars, area
        uiHint? : string;
        // used for bars and area plots
        // determines the y axis value that the bars/area originate from
        baseline? : number;
        lineColor? : string;
        pointColor? : string;
        lineThickness? : number;
        pointSize? : number
        fragmentGuids? : string[];
    }


    export interface TimelineTimeseriesFragment {
        fragmentGuid : string;
        data : number[];
        times_ISO8601 : string[];
    }


    export interface TimelineEvent {
        eventGuid : string;
        start_ISO8601 : string;
        end_ISO8601 : string;
        label : string;
        labelIcon? : string;
        userEditable? : boolean;
        styleGuid? : string;

        fgColor? : string;
        bgColor? : string;
        borderColor? : string;
    }


    export interface TimelineRow {
        rowGuid : string;
        label : string;
        yMin? : number;
        yMax? : number;
        uiHint? : string;
        eventGuids? : string[];
        timeseriesGuids? : string[];
    }


    export interface TimelineGroup {
        groupGuid : string;
        label : string;
        collapsed? : boolean;
        rowGuids : string[];
    }


    export interface TimelineRoot {
        groupGuids : string[];
    }


    export interface Timeline {
        timeseriesFragments : TimelineTimeseriesFragment[];
        timeseries : TimelineTimeseries[];
        events : TimelineEvent[];
        rows : TimelineRow[];
        groups : TimelineGroup[];
        root : TimelineRoot;
    }



    export class TimelineTimeseriesModel {
        private _timeseriesGuid : string;
        private _attrsChanged : Notification;
        private _uiHint : string;
        private _baseline : number;
        private _lineColor : Color;
        private _pointColor : Color;
        private _lineThickness : number;
        private _pointSize : number;
        private _fragmentGuids : OrderedStringSet;

        constructor( timeseries : TimelineTimeseries ) {
            this._timeseriesGuid = timeseries.timeseriesGuid;
            this._attrsChanged = new Notification( );
            this.setAttrs( timeseries );
            this._fragmentGuids = new OrderedStringSet( timeseries.fragmentGuids || [] );
        }

        get timeseriesGuid( ) : string {
            return this._timeseriesGuid;
        }

        get attrsChanged( ) : Notification {
            return this._attrsChanged;
        }

        setAttrs( timeseries : TimelineTimeseries ) {
            // Don't both checking whether values are going to change -- it's not that important, and it would be obnoxious here
            this._uiHint = timeseries.uiHint;
            this._baseline = timeseries.baseline;
            this._lineColor = ( hasval( timeseries.lineColor ) ? parseCssColor( timeseries.lineColor ) : null );
            this._pointColor = ( hasval( timeseries.pointColor ) ? parseCssColor( timeseries.pointColor ) : null );
            this._lineThickness = timeseries.lineThickness;
            this._pointSize = timeseries.pointSize;
            this._attrsChanged.fire( );
        }

        get baseline( ) : number {
            return this._baseline;
        }

        set baseline( baseline : number ) {
            if ( baseline !== this._baseline ) {
                this._baseline = baseline;
                this._attrsChanged.fire( );
            }
        }

        get lineColor( ) : Color {
            return this._lineColor;
        }

        set lineColor( lineColor : Color ) {
            if ( lineColor !== this._lineColor ) {
                this._lineColor = lineColor;
                this._attrsChanged.fire( );
            }
        }

        get pointColor( ) : Color {
            return this._pointColor;
        }

        set pointColor( pointColor : Color ) {
            if ( pointColor !== this._pointColor ) {
                this._pointColor = pointColor;
                this._attrsChanged.fire( );
            }
        }

        get lineThickness( ) : number {
            return this._lineThickness;
        }

        set lineThickness( lineThickness : number ) {
            if ( lineThickness !== this._lineThickness ) {
                this._lineThickness = lineThickness;
                this._attrsChanged.fire( );
            }
        }

        get pointSize( ) : number {
            return this._pointSize;
        }

        set pointSize( pointSize : number ) {
            if ( pointSize !== this._pointSize ) {
                this._pointSize = pointSize;
                this._attrsChanged.fire( );
            }
        }

        get uiHint( ) : string {
            return this._uiHint;
        }

        set uiHint( uiHint : string ) {
            if ( uiHint !== this._uiHint ) {
                this._uiHint = uiHint;
                this._attrsChanged.fire( );
            }
        }

        get fragmentGuids( ) : OrderedStringSet {
            return this._fragmentGuids;
        }

        snapshot( ) : TimelineTimeseries {
            return {
                timeseriesGuid: this._timeseriesGuid,
                uiHint: this._uiHint,
                baseline: this._baseline,
                lineColor: ( hasval( this._lineColor ) ? this._lineColor.cssString : null ),
                pointColor: ( hasval( this._pointColor ) ? this._pointColor.cssString : null ),
                lineThickness: this._lineThickness,
                pointSize: this._pointSize,
                fragmentGuids: this._fragmentGuids.toArray( ),
            };
        }
    }


    export class TimelineTimeseriesFragmentModel {
        private _fragmentGuid : string;
        private _attrsChanged : Notification;
        private _data : number[];
        private _times_PMILLIS : number[];

        constructor( fragment : TimelineTimeseriesFragment ) {
            this._fragmentGuid = fragment.fragmentGuid;
            this._attrsChanged = new Notification( );
            this.setAttrs( fragment );
        }

        get fragmentGuid( ) : string {
            return this._fragmentGuid;
        }

        get attrsChanged( ) : Notification {
            return this._attrsChanged;
        }

        setAttrs( fragment : TimelineTimeseriesFragment ) {
            this._times_PMILLIS = fragment.times_ISO8601.map( (value,index,array) => { return parseTime_PMILLIS(array[index]); } );
            this._data = fragment.data.slice( );
            this._attrsChanged.fire( );
        }

        get data( ) : number[] {
            return this._data;
        }

        set data( data : number[] ) {
            this._data = data;
        }

        get start_PMILLIS( ) : number {
            return this._times_PMILLIS[ 0 ];
        }

        get end_PMILLIS( ) : number {
            return this._times_PMILLIS.slice( -1 )[ 0 ];
        }

        get times_PMILLIS( ) : number[] {
            return this._times_PMILLIS;
        }

        set times_PMILLIS( _times_PMILLIS : number[] ) {
            this._times_PMILLIS = _times_PMILLIS;
        }

        snapshot( ) : TimelineTimeseriesFragment {
            return {
                fragmentGuid: this._fragmentGuid,
                data: this._data.slice( ),
                times_ISO8601: this._times_PMILLIS.map( (value,index,array) => { return formatTime_ISO8601(array[index]); } ),
            };
        }
    }


    export class TimelineEventModel {
        private _eventGuid : string;
        private _attrsChanged : Notification;
        private _start_PMILLIS : number;
        private _end_PMILLIS : number;
        private _label : string;
        private _labelIcon : string;
        private _userEditable : boolean;
        private _styleGuid : string;
        private _fgColor : Color;
        private _bgColor : Color;
        private _borderColor : Color;

        constructor( event : TimelineEvent ) {
            this._eventGuid = event.eventGuid;
            this._attrsChanged = new Notification( );
            this.setAttrs( event );
        }

        get eventGuid( ) : string {
            return this._eventGuid;
        }

        get attrsChanged( ) : Notification {
            return this._attrsChanged;
        }

        setAttrs( event : TimelineEvent ) {
            // Don't both checking whether values are going to change -- it's not that important, and it would be obnoxious here
            this._start_PMILLIS = parseTime_PMILLIS( event.start_ISO8601 );
            this._end_PMILLIS = parseTime_PMILLIS( event.end_ISO8601 );
            this._label = event.label;
            this._labelIcon = event.labelIcon;
            this._userEditable = ( hasval( event.userEditable ) ? event.userEditable : false );
            this._styleGuid = event.styleGuid;
            this._fgColor = ( hasval( event.fgColor ) ? parseCssColor( event.fgColor ) : null );
            this._bgColor = ( hasval( event.bgColor ) ? parseCssColor( event.bgColor ) : null );
            this._borderColor = ( hasval( event.borderColor ) ? parseCssColor( event.borderColor ) : null );
            this._attrsChanged.fire( );
        }

        setInterval( start_PMILLIS : number, end_PMILLIS : number ) {
            if ( start_PMILLIS !== this._start_PMILLIS || end_PMILLIS !== this._end_PMILLIS ) {
                this._start_PMILLIS = start_PMILLIS;
                this._end_PMILLIS = end_PMILLIS;
                this._attrsChanged.fire( );
            }
        }

        get start_PMILLIS( ) : number {
            return this._start_PMILLIS;
        }

        set start_PMILLIS( start_PMILLIS : number ) {
            if ( start_PMILLIS !== this._start_PMILLIS ) {
                this._start_PMILLIS = start_PMILLIS;
                this._attrsChanged.fire( );
            }
        }

        get end_PMILLIS( ) : number {
            return this._end_PMILLIS;
        }

        set end_PMILLIS( end_PMILLIS : number ) {
            if ( end_PMILLIS !== this._end_PMILLIS ) {
                this._end_PMILLIS = end_PMILLIS;
                this._attrsChanged.fire( );
            }
        }

        get label( ) : string {
            return this._label;
        }

        set label( label : string ) {
            if ( label !== this._label ) {
                this._label = label;
                this._attrsChanged.fire( );
            }
        }

        get labelIcon( ) : string {
            return this._labelIcon;
        }

        set labelIcon( labelIcon : string ) {
            if ( labelIcon !== this._labelIcon ) {
                this._labelIcon = labelIcon;
                this._attrsChanged.fire( );
            }
        }

        get userEditable( ) : boolean {
            return this._userEditable;
        }

        get styleGuid( ) : string {
            return this._styleGuid;
        }

        get fgColor( ) : Color {
            return this._fgColor;
        }

        set fgColor( fgColor : Color ) {
            if ( fgColor !== this._fgColor ) {
                this._fgColor = fgColor;
                this._attrsChanged.fire( );
            }
        }

        get bgColor( ) : Color {
            return this._bgColor;
        }

        set bgColor( bgColor : Color ) {
            if ( bgColor !== this._bgColor ) {
                this._bgColor = bgColor;
                this._attrsChanged.fire( );
            }
        }

        get borderColor( ) : Color {
            return this._borderColor;
        }

        set borderColor( borderColor : Color ) {
            if ( borderColor !== this._borderColor ) {
                this._borderColor = borderColor;
                this._attrsChanged.fire( );
            }
        }

        snapshot( ) : TimelineEvent {
            return {
                eventGuid: this._eventGuid,
                start_ISO8601: formatTime_ISO8601( this._start_PMILLIS ),
                end_ISO8601: formatTime_ISO8601( this._end_PMILLIS ),
                label: this._label,
                labelIcon: this._labelIcon,
                userEditable: this._userEditable,
                styleGuid: this._styleGuid,
                bgColor: ( hasval( this._bgColor ) ? this._bgColor.cssString : null ),
                fgColor: ( hasval( this._fgColor ) ? this._fgColor.cssString : null ),
                borderColor: ( hasval( this._borderColor ) ? this._borderColor.cssString : null )
            };
        }
    }


    export class TimelineRowModel {
        private _rowGuid : string;
        private _attrsChanged : Notification;
        private _label : string;
        private _uiHint : string;
        private _eventGuids : OrderedStringSet;
        private _timeseriesGuids : OrderedStringSet;
        private _dataAxis : Axis1D;

        constructor( row : TimelineRow ) {
            this._rowGuid = row.rowGuid;
            this._attrsChanged = new Notification( );
            
            var min : number = hasval( row.yMin ) ? row.yMin : 0;
            var max : number = hasval( row.yMax ) ? row.yMax : 1;
            this._dataAxis = new Axis1D( min, max );
            
            this.setAttrs( row );
            this._eventGuids = new OrderedStringSet( row.eventGuids || [] );
            this._timeseriesGuids = new OrderedStringSet( row.timeseriesGuids || [] );
        }

        get rowGuid( ) : string {
            return this._rowGuid;
        }

        get attrsChanged( ) : Notification {
            return this._attrsChanged;
        }

        setAttrs( row : TimelineRow ) {
            // Don't both checking whether values are going to change -- it's not that important, and it would be obnoxious here
            this._label = row.label;
            this._uiHint = row.uiHint;
            this._attrsChanged.fire( );
        }
        
        get dataAxis( ) : Axis1D {
           return this._dataAxis;
        }
        
        set dataAxis( dataAxis : Axis1D ) {
            this._dataAxis = dataAxis;
            this._attrsChanged.fire( );
        }

        get label( ) : string {
           return this._label;
        }

        set label( label : string ) {
            if ( label !== this._label ) {
                this._label = label;
                this._attrsChanged.fire( );
            }
        }

        get uiHint( ) : string {
           return this._uiHint;
        }

        set uiHint( uiHint : string ) {
            if ( uiHint !== this._uiHint ) {
                this._uiHint = uiHint;
                this._attrsChanged.fire( );
            }
        }

        get eventGuids( ) : OrderedStringSet {
            return this._eventGuids;
        }
        
        get timeseriesGuids( ) : OrderedStringSet {
            return this._timeseriesGuids;
        }

        snapshot( ) : TimelineRow {
            return {
                rowGuid: this._rowGuid,
                label: this._label,
                uiHint: this._uiHint,
                eventGuids: this._eventGuids.toArray( ),
                timeseriesGuids: this._timeseriesGuids.toArray( ),
            };
        }
    }


    export class TimelineGroupModel {
        private _groupGuid : string;
        private _attrsChanged : Notification;
        private _label : string;
        private _collapsed : boolean;
        private _rowGuids : OrderedStringSet;

        constructor( group : TimelineGroup ) {
            this._groupGuid = group.groupGuid;
            this._attrsChanged = new Notification( );
            this.setAttrs( group );
            this._rowGuids = new OrderedStringSet( group.rowGuids );
        }

        get groupGuid( ) : string {
            return this._groupGuid;
        }

        get attrsChanged( ) : Notification {
            return this._attrsChanged;
        }

        setAttrs( group : TimelineGroup ) {
            // Don't both checking whether values are going to change -- it's not that important, and it would be obnoxious here
            this._label = group.label;
            this._collapsed = group.collapsed;
            this._attrsChanged.fire( );
        }

        get label( ) : string {
            return this._label;
        }

        set label( label : string ) {
            if ( label !== this._label ) {
                this._label = label;
                this._attrsChanged.fire( );
            }
        }

        get collapsed( ) : boolean {
            return this._collapsed;
        }

        set collapsed( collapsed : boolean ) {
            if ( collapsed !== this._collapsed ) {
                this._collapsed = collapsed;
                this._attrsChanged.fire( );
            }
        }

        get rowGuids( ) : OrderedStringSet {
            return this._rowGuids;
        }

        snapshot( ) : TimelineGroup {
            return {
                groupGuid: this._groupGuid,
                label: this._label,
                collapsed: ( hasval( this._collapsed ) ? this._collapsed : false ),
                rowGuids: this._rowGuids.toArray( )
            };
        }
    }


    export class TimelineRootModel {
        private _attrsChanged : Notification;
        private _groupGuids : OrderedStringSet;

        constructor( root : TimelineRoot ) {
            this._attrsChanged = new Notification( );
            this.setAttrs( root );
            this._groupGuids = new OrderedStringSet( root.groupGuids );
        }

        get attrsChanged( ) : Notification {
            return this._attrsChanged;
        }

        setAttrs( root : TimelineRoot ) {
            // Don't both checking whether values are going to change -- it's not that important, and it would be obnoxious here
            // No attrs yet
            this._attrsChanged.fire( );
        }

        get groupGuids( ) : OrderedStringSet {
            return this._groupGuids;
        }

        snapshot( ) : TimelineRoot {
            return {
                groupGuids: this._groupGuids.toArray( )
            };
        }
    }


    export interface TimelineMergeStrategy {
        updateTimeseriesFragmentModel( timeseriesFragmentModel : TimelineTimeseriesFragmentModel, newTimeseriesFragment : TimelineTimeseriesFragment );
        updateTimeseriesModel( timeseriesModel : TimelineTimeseriesModel, newTimeseries : TimelineTimeseries );
        updateEventModel( eventModel : TimelineEventModel, newEvent : TimelineEvent );
        updateRowModel( rowModel : TimelineRowModel, newRow : TimelineRow );
        updateGroupModel( groupModel : TimelineGroupModel, newGroup : TimelineGroup );
        updateRootModel( rootModel : TimelineRootModel, newRoot : TimelineRoot );
    }


    export class TimelineModel {
        private _timeseriesFragments : OrderedSet<TimelineTimeseriesFragmentModel>;
        private _timeseries : OrderedSet<TimelineTimeseriesModel>;
        private _events : OrderedSet<TimelineEventModel>;
        private _rows : OrderedSet<TimelineRowModel>;
        private _groups : OrderedSet<TimelineGroupModel>;
        private _root : TimelineRootModel;

        constructor( timeline? : Timeline ) {
        
            var timeseriesFragments = ( hasval( timeline ) && hasval( timeline.timeseriesFragments ) ? timeline.timeseriesFragments : [] );
            this._timeseriesFragments = new OrderedSet<TimelineTimeseriesFragmentModel>( [], (e)=>e.fragmentGuid );
            for ( var n = 0; n < timeseriesFragments.length; n++ ) {
                this._timeseriesFragments.add( new TimelineTimeseriesFragmentModel( timeseriesFragments[ n ] ) );
            }
            
            var timeseries = ( hasval( timeline ) && hasval( timeline.timeseries ) ? timeline.timeseries : [] );
            this._timeseries = new OrderedSet<TimelineTimeseriesModel>( [], (e)=>e.timeseriesGuid );
            for ( var n = 0; n < timeseries.length; n++ ) {
                this._timeseries.add( new TimelineTimeseriesModel( timeseries[ n ] ) );
            }
            
            var events = ( hasval( timeline ) && hasval( timeline.events ) ? timeline.events : [] );
            this._events = new OrderedSet<TimelineEventModel>( [], (e)=>e.eventGuid );
            for ( var n = 0; n < events.length; n++ ) {
                this._events.add( new TimelineEventModel( events[ n ] ) );
            }

            var rows = ( hasval( timeline ) && hasval( timeline.rows ) ? timeline.rows : [] );
            this._rows = new OrderedSet<TimelineRowModel>( [], (r)=>r.rowGuid );
            for ( var n = 0; n < rows.length; n++ ) {
                this._rows.add( new TimelineRowModel( rows[ n ] ) );
            }

            var groups = ( hasval( timeline ) && hasval( timeline.groups ) ? timeline.groups : [] );
            this._groups = new OrderedSet<TimelineGroupModel>( [], (g)=>g.groupGuid );
            for ( var n = 0; n < groups.length; n++ ) {
                this._groups.add( new TimelineGroupModel( groups[ n ] ) );
            }

            var root = ( hasval( timeline ) && hasval( timeline.root ) ? timeline.root : newEmptyTimelineRoot( ) );
            this._root = new TimelineRootModel( root );
        }
        
        get timeseriesFragments( ) : OrderedSet<TimelineTimeseriesFragmentModel> { return this._timeseriesFragments; }
        get timeseriesSets( ) : OrderedSet<TimelineTimeseriesModel> { return this._timeseries; }
        get events( ) : OrderedSet<TimelineEventModel> { return this._events; }
        get rows( ) : OrderedSet<TimelineRowModel> { return this._rows; }
        get groups( ) : OrderedSet<TimelineGroupModel> { return this._groups; }
        get root( ) : TimelineRootModel { return this._root; }

        timeseriesFragment( fragmentGuid : string ) : TimelineTimeseriesFragmentModel { return this._timeseriesFragments.valueFor( fragmentGuid ); }
        timeseries( timeseriesGuid : string ) : TimelineTimeseriesModel { return this._timeseries.valueFor( timeseriesGuid ); }
        event( eventGuid : string ) : TimelineEventModel { return this._events.valueFor( eventGuid ); }
        row( rowGuid : string ) : TimelineRowModel { return this._rows.valueFor( rowGuid ); }
        group( groupGuid : string ) : TimelineGroupModel { return this._groups.valueFor( groupGuid ); }


        replace( newTimeline : Timeline ) {

            // Purge removed items
            //

            var freshRoot = newTimeline.root;
            this._root.groupGuids.retainValues( freshRoot.groupGuids );

            var freshGroups = newTimeline.groups;
            var retainedGroupGuids : string[] = [];
            for ( var n = 0; n < freshGroups.length; n++ ) {
                var freshGroup = freshGroups[ n ];
                var groupGuid = freshGroup.groupGuid;
                var oldGroup = this._groups.valueFor( groupGuid );
                if ( hasval( oldGroup ) ) {
                    oldGroup.rowGuids.retainValues( freshGroup.rowGuids );
                    retainedGroupGuids.push( groupGuid );
                }
            }
            this._groups.retainIds( retainedGroupGuids );

            var freshRows = newTimeline.rows;
            var retainedRowGuids : string[] = [];
            for ( var n = 0; n < freshRows.length; n++ ) {
                var freshRow = freshRows[ n ];
                var rowGuid = freshRow.rowGuid;
                var oldRow = this._rows.valueFor( rowGuid );
                if ( hasval( oldRow ) ) {
                    oldRow.eventGuids.retainValues( freshRow.eventGuids || [] );
                    retainedRowGuids.push( rowGuid );
                }
            }
            this._rows.retainIds( retainedRowGuids );

            var freshEvents = newTimeline.events;
            var retainedEventGuids : string[] = [];
            for ( var n = 0; n < freshEvents.length; n++ ) {
                var freshEvent = freshEvents[ n ];
                var eventGuid = freshEvent.eventGuid;
                var oldEvent = this._events.valueFor( eventGuid );
                if ( hasval( oldEvent ) ) {
                    retainedEventGuids.push( eventGuid );
                }
            }
            this._events.retainIds( retainedEventGuids );

            var freshTimeseriesSet = newTimeline.timeseries;
            var retainedTimeseriesGuids : string[] = [];
            for ( var n = 0; n < freshTimeseriesSet.length; n++ ) {
                var freshTimeseries = freshTimeseriesSet[ n ];
                var timeseriesGuid = freshTimeseries.timeseriesGuid;
                var oldTimeseries = this._timeseries.valueFor( timeseriesGuid );
                if ( hasval( oldTimeseries ) ) {
                    retainedTimeseriesGuids.push( timeseriesGuid );
                }
            }
            this._timeseries.retainIds( retainedTimeseriesGuids );
            
            var freshTimeseriesFragments = newTimeline.timeseriesFragments;
            var retainedTimeseriesFragmentGuids : string[] = [];
            for ( var n = 0; n < freshTimeseriesFragments.length; n++ ) {
                var freshTimeseriesFragment = freshTimeseriesFragments[ n ];
                var fragmentGuid = freshTimeseriesFragment.fragmentGuid;
                var oldTimeseriesFragment = this._timeseriesFragments.valueFor( fragmentGuid );
                if ( hasval( oldTimeseriesFragment ) ) {
                    retainedTimeseriesFragmentGuids.push( fragmentGuid );
                }
            }
            this._timeseriesFragments.retainIds( retainedTimeseriesFragmentGuids );
            
            // Add new items
            //
            
            for ( var n = 0; n < freshTimeseriesFragments.length; n++ ) {
                var freshTimeseriesFragment = freshTimeseriesFragments[ n ];
                var oldTimeseriesFragment = this._timeseriesFragments.valueFor( freshTimeseriesFragment.fragmentGuid );
                if ( hasval( oldTimeseriesFragment ) ) {
                    oldTimeseriesFragment.setAttrs( freshTimeseriesFragment );
                }
                else {
                    this._timeseriesFragments.add( new TimelineTimeseriesFragmentModel( freshTimeseriesFragment ) );
                }
            }
            
            for ( var n = 0; n < freshTimeseriesSet.length; n++ ) {
                var freshTimeseries = freshTimeseriesSet[ n ];
                var oldTimeseries = this._timeseries.valueFor( freshTimeseries.timeseriesGuid );
                if ( hasval( oldTimeseries ) ) {
                    oldTimeseries.setAttrs( freshTimeseries );
                }
                else {
                    this._timeseries.add( new TimelineTimeseriesModel( freshTimeseries ) );
                }
            }

            for ( var n = 0; n < freshEvents.length; n++ ) {
                var freshEvent = freshEvents[ n ];
                var oldEvent = this._events.valueFor( freshEvent.eventGuid );
                if ( hasval( oldEvent ) ) {
                    oldEvent.setAttrs( freshEvent );
                }
                else {
                    this._events.add( new TimelineEventModel( freshEvent ) );
                }
            }

            for ( var n = 0; n < freshRows.length; n++ ) {
                var freshRow = freshRows[ n ];
                var oldRow = this._rows.valueFor( freshRow.rowGuid );
                if ( hasval( oldRow ) ) {
                    oldRow.setAttrs( freshRow );
                    oldRow.eventGuids.addAll( ( freshRow.eventGuids || [] ), 0, true );
                }
                else {
                    this._rows.add( new TimelineRowModel( freshRow ) );
                }
            }

            for ( var n = 0; n < freshGroups.length; n++ ) {
                var freshGroup = freshGroups[ n ];
                var oldGroup = this._groups.valueFor( freshGroup.groupGuid );
                if ( hasval( oldGroup ) ) {
                    oldGroup.setAttrs( freshGroup );
                    oldGroup.rowGuids.addAll( freshGroup.rowGuids, 0, true );
                }
                else {
                    this._groups.add( new TimelineGroupModel( freshGroup ) );
                }
            }

            this._root.groupGuids.addAll( freshRoot.groupGuids, 0, true );
        }


        merge( newData : Timeline, strategy : TimelineMergeStrategy ) {
        
            var newTimeseriesFragments = hasval( newData.timeseriesFragments ) ? newData.timeseriesFragments : [];
            for ( var n = 0; n < newTimeseriesFragments.length; n++ ) {
                var newTimeseriesFragment = newTimeseriesFragments[ n ];
                var timeseriesFragmentModel = this._timeseriesFragments.valueFor( newTimeseriesFragment.fragmentGuid );
                if ( hasval( timeseriesFragmentModel ) ) {
                    strategy.updateTimeseriesFragmentModel( timeseriesFragmentModel, newTimeseriesFragment );
                }
                else {
                    this._timeseriesFragments.add( new TimelineTimeseriesFragmentModel( newTimeseriesFragment ) );
                }
            }
            
            var newTimeseriesSet = hasval( newData.timeseries ) ? newData.timeseries : [];
            for ( var n = 0; n < newTimeseriesSet.length; n++ ) {
                var newTimeseries = newTimeseriesSet[ n ];
                var timeseriesModel = this._timeseries.valueFor( newTimeseries.timeseriesGuid );
                if ( hasval( timeseriesModel ) ) {
                    strategy.updateTimeseriesModel( timeseriesModel, newTimeseries );
                }
                else {
                    this._timeseries.add( new TimelineTimeseriesModel( newTimeseries ) );
                }
            }
            
            var newEvents = hasval( newData.events ) ? newData.events : [];
            for ( var n = 0; n < newEvents.length; n++ ) {
                var newEvent = newEvents[ n ];
                var eventModel = this._events.valueFor( newEvent.eventGuid );
                if ( hasval( eventModel ) ) {
                    strategy.updateEventModel( eventModel, newEvent );
                }
                else {
                    this._events.add( new TimelineEventModel( newEvent ) );
                }
            }

            var newRows = hasval( newData.rows ) ? newData.rows : [];
            for ( var n = 0; n < newRows.length; n++ ) {
                var newRow = newRows[ n ];
                var rowModel = this._rows.valueFor( newRow.rowGuid );
                if ( hasval( rowModel ) ) {
                    strategy.updateRowModel( rowModel, newRow );
                }
                else {
                    this._rows.add( new TimelineRowModel( newRow ) );
                }
            }

            var newGroups = hasval( newData.groups ) ? newData.groups : [];
            for ( var n = 0; n < newGroups.length; n++ ) {
                var newGroup = newGroups[ n ];
                var groupModel = this._groups.valueFor( newGroup.groupGuid );
                if ( hasval( groupModel ) ) {
                    strategy.updateGroupModel( groupModel, newGroup );
                }
                else {
                    this._groups.add( new TimelineGroupModel( newGroup ) );
                }
            }

            var newRoot = newData.root;
            strategy.updateRootModel( this._root, newRoot );
        }

        snapshot( ) : Timeline {
            return {
                timeseriesFragments : this._timeseriesFragments.map( (e)=>e.snapshot() ),
                timeseries : this._timeseries.map( (e)=>e.snapshot() ),
                events : this._events.map( (e)=>e.snapshot() ),
                rows : this._rows.map( (r)=>r.snapshot() ),
                groups : this._groups.map( (g)=>g.snapshot() ),
                root : this._root.snapshot( )
            };
        }


    }


    export function newEmptyTimelineRoot( ) : TimelineRoot {
        return { groupGuids: [] };
    }


    export var timelineMergeNewBeforeOld : TimelineMergeStrategy = {
        updateTimeseriesFragmentModel( timeseriesFragmentModel : TimelineTimeseriesFragmentModel, newTimeseriesFragment : TimelineTimeseriesFragment ) {
            timeseriesFragmentModel.setAttrs( newTimeseriesFragment );
        },
        
        updateTimeseriesModel( timeseriesModel : TimelineTimeseriesModel, newTimeseries : TimelineTimeseries ) {
            timeseriesModel.setAttrs( newTimeseries );
            timeseriesModel.fragmentGuids.addAll( ( newTimeseries.fragmentGuids || [] ), 0, true );
        },
        
        updateEventModel: function( eventModel : TimelineEventModel, newEvent : TimelineEvent ) {
            eventModel.setAttrs( newEvent );
        },

        updateRowModel: function( rowModel : TimelineRowModel, newRow : TimelineRow ) {
            rowModel.setAttrs( newRow );
            rowModel.eventGuids.addAll( ( newRow.eventGuids || [] ), 0, true );
        },

        updateGroupModel: function( groupModel : TimelineGroupModel, newGroup : TimelineGroup ) {
            groupModel.setAttrs( newGroup );
            groupModel.rowGuids.addAll( newGroup.rowGuids, 0, true );
        },

        updateRootModel: function( rootModel : TimelineRootModel, newRoot : TimelineRoot ) {
            rootModel.setAttrs( newRoot );
            rootModel.groupGuids.addAll( newRoot.groupGuids, 0, true );
        }
    };


    export var timelineMergeNewAfterOld : TimelineMergeStrategy = {
        updateTimeseriesFragmentModel( timeseriesFragmentModel : TimelineTimeseriesFragmentModel, newTimeseriesFragment : TimelineTimeseriesFragment ) {
            timeseriesFragmentModel.setAttrs( newTimeseriesFragment );
        },
        
        updateTimeseriesModel( timeseriesModel : TimelineTimeseriesModel, newTimeseries : TimelineTimeseries ) {
            timeseriesModel.setAttrs( newTimeseries );
            timeseriesModel.fragmentGuids.addAll( newTimeseries.fragmentGuids || [] );
        },
        
        updateEventModel: function( eventModel : TimelineEventModel, newEvent : TimelineEvent ) {
            eventModel.setAttrs( newEvent );
        },

        updateRowModel: function( rowModel : TimelineRowModel, newRow : TimelineRow ) {
            rowModel.setAttrs( newRow );
            rowModel.eventGuids.addAll( newRow.eventGuids || [] );
        },

        updateGroupModel: function( groupModel : TimelineGroupModel, newGroup : TimelineGroup ) {
            groupModel.setAttrs( newGroup );
            groupModel.rowGuids.addAll( newGroup.rowGuids );
        },

        updateRootModel: function( rootModel : TimelineRootModel, newRoot : TimelineRoot ) {
            rootModel.setAttrs( newRoot );
            rootModel.groupGuids.addAll( newRoot.groupGuids );
        }
    };


}