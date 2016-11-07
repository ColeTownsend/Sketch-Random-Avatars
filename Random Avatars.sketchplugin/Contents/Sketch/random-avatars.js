//Based on the original source of Nick Stamas @nickstamas https://github.com/nickstamas/Sketch-Quick-Pic
//based on @timur_carpeev modifications at https://github.com/timuric/Content-generator-sketch-plugin/blob/a4969d3b1c90da2ca4d184e104c73eab9416dc11/CG.sketchplugin/Contents/Sketch/Images/Rad%20faces.js
//Modified by @coletownsend

function onRun(context){
  var selection = context.selection;
  var doc = context.document;

  if (selection.length > 0) {
    log(selection.length);

    var request = [[NSMutableURLRequest alloc] init];
    [request setHTTPMethod:@"GET"];
    var queryString = "https://randomuser.me/api/?results=" + selection.length * 10;
    [request setURL:[NSURL URLWithString:queryString]];

    var error = [[NSError alloc] init];
    var responseCode = null;

    var oResponseData = [NSURLConnection sendSynchronousRequest:request returningResponse:responseCode error:error];

    var dataString = [[NSString alloc] initWithData:oResponseData
    encoding:NSUTF8StringEncoding];

    var pattern = new RegExp("\\\\'", "g");
    var validJSONString = dataString.replace(pattern, "'");

    var data = JSON.parse(validJSONString);

    log(data.results.length);

    if (data.results.length > 0) {
      for (var i=0; i <= selection.length; i++) {

        var randomIndex = Math.floor(Math.random()*(data.results.length-1));
        log(randomIndex);
        var imageURLString = data.results[randomIndex].picture.large;
        var url = [[NSURL alloc] initWithString: imageURLString];

        var newImage = [[NSImage alloc] initByReferencingURL:url];

        var layer = [selection objectAtIndex:i];
        layer.setName(data.results[randomIndex].name.first.toUpperCase() + " " + data.results[randomIndex].name.last.toUpperCase());

        var fill = layer.style().fills().firstObject();
        fill.setFillType(4);
        fill.setImage(MSImageData.alloc().initWithImage_convertColorSpace(newImage, false));
        fill.setPatternFillType(1);
      }
    } else {
      var message = "No images found.";
      [doc showMessage: message];
    }
  } else {
    var message = "No layer is selected.";
    [doc showMessage: message];
  }
}
