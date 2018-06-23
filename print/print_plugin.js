/*
 * Copyright 2018 Collobos Software Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated 
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions
 * of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 * THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

/*
 * lookupPrinters
 *
 * This function will return all the printers that this plugin wants to create in Presto
 *
 * Each printer should be written to stdout, as stringified JSON
 *
 */

function lookupPrinters()
{
    let printer = (
    {
        bpp: 8,						// 8 bits monochrome,
                                    // 24 bits color
        note: "",
        info: "Presto Virtual Printer",
        resource: "presto://127.0.0.1/presto_virtual_printer",
        name: "Presto Virtual Printer",
        uuid: "399C0049-8914-4ADA-851D-B4B52C394B17",
        'make-and-model': "Presto Virtual Printer",
        media:
        [
            {
                name: "na_letter_8.5x11in",
                klass: 0,
                width: 21590,
                width_points: 612,
                type: 5,
                height: 27940,
                height_points: 792,
            }
        ],
        media_ready:
        [
            "na_letter_8.5x11in"
        ],
        media_default: "na_letter_8.5x11in",
        copy: 99,
        quality_default: 4,       // draft = 3, normal = 4, high = 5
        quality_supported:
        [
            3,
            4,
            5
        ],
        orientation_default: 3,   // portrait = 3,
                                  // landscape = 4,
                                  // reverse_landscape = 5,
                                  // reverse_portrait = 6
        orientation_supported:
        [
            3,
            4
        ],
        side_default: 0,		  // none = 0,
                                  // long_edge = 1,
                                  // short_edge = 2
        side_supported:
        [
            0,
            1,
            2
        ],
        state: 3,				  // idle = 3,
                                  // processing = 4,
                                  // stopped = 5

        reasons: 0				  // none					    = 0x0000,
                                  // other					    = 0x0001,
                                  // cover_open				    = 0x0002,
                                  // input_tray_missing		    = 0x0004,
                                  // marker_supply_empty		= 0x0008,
                                  // marker_supply_low		    = 0x0010,
                                  // marker_waste_almost_full	= 0x0020,
                                  // marker_waste_full		    = 0x0040,
                                  // media_empty				= 0x0080,
                                  // media_jam				    = 0x0100,
                                  // media_low				    = 0x0200,
                                  // media_needed				= 0x0400,
                                  // offline					= 0x0800,
                                  // paused					    = 0x1000,
                                  // spool_area_full			= 0x2000,
                                  // toner_empty				= 0x4000,
                                  // toner_low				    = 0x8000

    } );

    console.log( JSON.stringify( printer ) );

    process.exit( 0 );
}

/*
 * startJob
 *
 * This function handles actually printing the file
 *
 */

function startJob( user, dest, job, file )
{
    /*
     * This code doesn't do anything but set the state of the job to completed.
     *
     * Valid states are:
     *
     * pending		= 3,
     * held			= 4,
     * processing	= 5,
     * stopped		= 6,
     * cancelled	= 7,
     * aborted		= 8,
     * completed	= 9
     */

    job.state = 9;

    return job;
}

/*
 * cancelJob
 *
 * This function handles cancelling a job that was already started
 *
 */

function cancelJob( dest, job )
{
}

function getInfoFromStdin( callback )
{
    process.stdin.on( 'data', data =>
    {
        try
        {
            let info = JSON.parse( data );

            callback( null, info );
        }
        catch( err )
        {
            callback( err, null );
        }
    } );
}

if ( process.argv[ 2 ] === '--lookup-printers' )
{
    lookupPrinters();
}
else if ( process.argv[ 2 ] === '--start-job' )
{
    getInfoFromStdin( ( err, info ) =>
    {
        if ( !err )
        {
            let ret	= startJob( info.user, info.dest, info.job, info.file );

            console.log( JSON.stringify( ret ) );

            process.exit( 0 );
        }
        else
        {
            process.exit( 1 );
        }
    } );
}
else if ( process.argv[ 2 ] === '--cancel-job' )
{
    getInfoFromStdin( ( err, info ) =>
    {
        if ( !err )
        {
            cancelJob( info.dest, info.job );

            process.exit( 0 );
        }
        else
        {
            process.exit( 1 );
        }
    } );
}
