class Fedex{
  constructor (credentials, quote_params){}

  getPricing(){

    const xmlValues = {};
    xmlValues.accountNumber = '510087720';
    xmlValues.meterNumber = '119238439';
    xmlValues.LanguageCode = 'es';
    xmlValues.LocaleCode = 'mx';
    xmlValues.ServiceId = 'crs';
    xmlValues.Major = 13;
    xmlValues.Intermediate = 0;
    xmlValues.Minor = 0;
    xmlValues.ReturnTransitAndCommit = 'true';
    xmlValues.DropoffType = 'REGULAR_PICKUP';
    xmlValues.PackaginType = 'YOUR_PACKAGING';

    let xmlBlock = '';

    xmlBlock = '<RateRequest xmlns="http://fedex.com/ws/rate/v13">' +
      '<WebAuthenticationDetail>'+
        '<UserCredential>'+
          '<Key>' + credentials.key + '</Key>'+
          '<Password>' + credentials.password + '</Password>'+
        '</UserCredential>'+
      '</WebAuthenticationDetail>'+
      '<ClientDetail>'+
        '<AccountNumber>'+ xmlValues.accountNumber +'</AccountNumber>'+
        '<MeterNumber>' + xmlValues.meterNumber + '</MeterNumber>'+
        '<Localization>'+
          '<LanguageCode>' + xmlValues.LanguajeCode + '</LanguageCode>'+
          '<LocaleCode>' + xmlValues.LocaleCode + '</LocaleCode>'+
        '</Localization>'+
      '</ClientDetail>'+
      '<Version>'+
        '<ServiceId>' + xmlValues.ServiceId + '</ServiceId>'+
        '<Major>' + xmlValues.Major + '</Major>'+
        '<Intermediate>' + xmlValues.Intermediate + '</Intermediate>'+
        '<Minor>' + xmlValues.Minor + '</Minor>'+
      '</Version>'+
      '<ReturnTransitAndCommit>' + xmlValues.ReturnTransitAndCommit + '</ReturnTransitAndCommit>'+
      '<RequestedShipment>'+
        '<DropoffType>' + xmlValues.DropoffType + '</DropoffType>'+
        '<PackagingType>' + xmlValues.PackaginType + '</PackagingType>'+
        '<Shipper>'+
          '<Address>'+
            '<StreetLines></StreetLines>'+
            '<City></City>'+
            '<StateOrProvinceCode>XX</StateOrProvinceCode>'+
            '<PostalCode>' + quote_params.address_from.zip + '</PostalCode>'+
            '<CountryCode>' + quote_params.address_from.country + '</CountryCode>'+
          '</Address>'+
        '</Shipper>'+
        '<Recipient>'+
          '<Address>'+
            '<StreetLines></StreetLines>'+
            '<City></City>'+
            '<StateOrProvinceCode>XX</StateOrProvinceCode>'+
            '<PostalCode>' + quote_params.address_to.zip + '</PostalCode>'+
            '<CountryCode>' + quote_params.address_to.country + '</CountryCode>'+
            '<Residential>false</Residential>'+
          '</Address>'+
        '</Recipient>'+
        '<ShippingChargesPayment>'+
          '<PaymentType>SENDER</PaymentType>'+
        '</ShippingChargesPayment>'+
        '<RateRequestTypes>ACCOUNT</RateRequestTypes>'+
        '<PackageCount>1</PackageCount>'+
        '<RequestedPackageLineItems>'+
          '<GroupPackageCount>1</GroupPackageCount>'+
          '<Weight>'+
            '<Units>' + quote_params.parcel.mass_unit + '</Units>'+
            '<Value>' + quote_params.parcel.weight + '</Value>'+
          '</Weight>'+
          '<Dimensions>'+
          '<Length>' + quote_params.parcel.length + '</Length>'+
          '<Width>' + quote_params.parcel.width + '</Width>'+
          '<Height>' + quote_params.parcel.height + '</Height>'+
          '<Units>' + quote_params.parcel.distance_unit + '</Units>'+
          '</Dimensions>'+
        '</RequestedPackageLineItems>'+
      '</RequestedShipment>'+
    '</RateRequest>';

    const callObj = {};
    callObj.host = 'https://wsbeta.fedex.com';
    callObj.path = '/xml';
    callObj.port = 443;
    callObj.method = 'POST';

    const postRequest = {
      host: callObj.host,
      path: callObj.path,
      port: callObj.port,
      method: callObj.method,
      headers: {
          'Cookie': "cookie",
          'Content-Type': 'text/xml'
      }
    }

    const https = require('https');

    const req = http.request( postRequest, function( res )    {

      console.log( res.statusCode );
      var buffer = "";
      res.on( "data", function( data ) { buffer = buffer + data; } );
      res.on( "end", function( data ) { console.log( buffer ); } );

    });

    console.table(req);
  }
}



