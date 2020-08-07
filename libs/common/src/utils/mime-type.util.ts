export class MimeTypeNames {
  /**
   * @description Used to denote the encoding necessary for files containing JavaScript source code.
   * @description The alternative MIME type for this file type is text/javascript.
   */
  public static ApplicationXJavascript = 'application/x-javascript';

  /**
   * @description 24bit Linear PCM audio at 8-48kHz, 1-N channels; Defined in RFC 3190
   */
  public static AudioL24 = 'audio/L24';

  /**
   * @description Adobe Flash files for example with the extension .swf
   */
  public static ApplicationXShockwaveFlash = 'application/x-shockwave-flash';

  /**
   * @description Arbitrary binary data.[5] Generally speaking this type identifies files that are not associated with a specific application.
   * @description Contrary to past assumptions by software packages such as Apache this is not a type that should be applied to unknown files.
   * @description In such a case, a server or application should not indicate a content type, as it may be incorrect, but rather,
   * @description should omit the type in order to allow the recipient to guess the type.[6]
   */
  public static ApplicationOctetStream = 'application/octet-stream';

  /**
   * @description Atom feeds
   */
  public static ApplicationAtomXml = 'application/atom+xml';

  /**
   * @description Cascading Style Sheets; Defined in RFC 2318
   */
  public static TextCss = 'text/css';

  /**
   * @description commands; subtype resident in Gecko browsers like Firefox 3.5
   */
  public static TextCmd = 'text/cmd';

  /**
   * @description Comma-separated values; Defined in RFC 4180
   */
  public static TextCsv = 'text/csv';

  /**
   * @description deb (file format), a software package format used by the Debian project
   */
  public static ApplicationXDeb = 'application/x-deb';

  /**
   * @description Defined in RFC 1847
   */
  public static MultipartEncrypted = 'multipart/encrypted';

  /**
   * @description Defined in RFC 1847
   */
  public static MultipartSigned = 'multipart/signed';

  /**
   * @description Defined in RFC 2616
   */
  public static MessageHttp = 'message/http';

  /**
   * @description Defined in RFC 4735
   */
  public static ModelExample = 'model/example';

  /**
   * @description device-independent document in DVI format
   */
  public static ApplicationXDvi = 'application/x-dvi';

  /**
   * @description DTD files; Defined by RFC 3023
   */
  public static ApplicationXmlDtd = 'application/xml-dtd';

  /**
   * @description ECMAScript/JavaScript; Defined in RFC 4329 (equivalent to application/ecmascript but with looser processing rules)
   * @description It is not accepted in IE 8 or earlier - text/javascript is accepted but it is defined as obsolete in RFC 4329.
   * @description The "type" attribute of the <script> tag in HTML5 is optional and in practice omitting the media type of JavaScript
   * @description programs is the most interoperable solution since all browsers have always assumed the correct default even before HTML5.
   */
  public static ApplicationJavascript = 'application/javascript';

  /**
   * @description ECMAScript/JavaScript; Defined in RFC 4329 (equivalent to application/javascript but with stricter processing rules)
   */
  public static ApplicationEcmascript = 'application/ecmascript';

  /**
   * @description EDI EDIFACT data; Defined in RFC 1767
   */
  public static ApplicationEdifact = 'application/EDIFACT';

  /**
   * @description EDI X12 data; Defined in RFC 1767
   */
  public static ApplicationEdiX12 = 'application/EDI-X12';

  /**
   * @description Email; Defined in RFC 2045 and RFC 2046
   */
  public static MessagePartial = 'message/partial';

  /**
   * @description Email; EML files, MIME files, MHT files, MHTML files; Defined in RFC 2045 and RFC 2046
   */
  public static MessageRfc822 = 'message/rfc822';

  /**
   * @description Extensible Markup Language; Defined in RFC 3023
   */
  public static TextXml = 'text/xml';

  /**
   * @description Flash video (FLV files)
   */
  public static VideoXFlv = 'video/x-flv';

  /**
   * @description GIF image; Defined in RFC 2045 and RFC 2046
   */
  public static ImageGif = 'image/gif';

  /**
   * @description GoogleWebToolkit data
   */
  public static TextXGwtRpc = 'text/x-gwt-rpc';

  /**
   * @description Gzip
   */
  public static ApplicationXGzip = 'application/x-gzip';

  /**
   * @description HTML; Defined in RFC 2854
   */
  public static TextHtml = 'text/html';

  /**
   * @description ICO image; Registered[9]
   */
  public static ImageVndMicrosoftIcon = 'image/vnd.microsoft.icon';

  /**
   * @description IGS files, IGES files; Defined in RFC 2077
   */
  public static ModelIges = 'model/iges';

  /**
   * @description IMDN Instant Message Disposition Notification; Defined in RFC 5438
   */
  public static MessageImdnXml = 'message/imdn+xml';

  /**
   * @description JavaScript Object Notation JSON; Defined in RFC 4627
   */
  public static ApplicationJson = 'application/json';

  /**
   * @description JavaScript Object Notation (JSON) Patch; Defined in RFC 6902
   */
  public static ApplicationJsonPatch = 'application/json-patch+json';

  /**
   * @description JavaScript - Defined in and obsoleted by RFC 4329 in order to discourage its usage in favor of application/javascript.
   * @description However,text/javascript is allowed in HTML 4 and 5 and, unlike application/javascript, has cross-browser support.
   * @description The "type" attribute of the <script> tag in HTML5 is optional and there is no need to use it at all since all browsers
   * @description have always assumed the correct default (even in HTML 4 where it was required by the specification).
   */
  public static TextJavascript = 'text/javascript';

  /**
   * @description JPEG JFIF image; Associated with Internet Explorer; Listed in ms775147(v=vs.85) - Progressive JPEG,
   * @description initiated before global browser support for progressive JPEGs (Microsoft and Firefox).
   */
  public static ImagePjpeg = 'image/pjpeg';

  /**
   * @description JPEG JFIF image; Defined in RFC 2045 and RFC 2046
   */
  public static ImageJpeg = 'image/jpeg';

  /**
   * @description jQuery template data
   */
  public static TextXJqueryTmpl = 'text/x-jquery-tmpl';

  /**
   * @description KML files (e.g. for Google Earth)
   */
  public static ApplicationVndGoogleEarthKmlXml =
    'application/vnd.google-earth.kml+xml';

  /**
   * @description LaTeX files
   */
  public static ApplicationXLatex = 'application/x-latex';

  /**
   * @description Matroska open media format
   */
  public static VideoXMatroska = 'video/x-matroska';

  /**
   * @description Microsoft Excel 2007 files
   */
  public static ApplicationVndOpenxmlformatsOfficedocumentSpreadsheetmlSheet =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

  /**
   * @description Microsoft Excel files
   */
  public static ApplicationVndMsExcel = 'application/vnd.ms-excel';

  /**
   * @description Microsoft Powerpoint 2007 files
   */
  public static ApplicationVndOpenxmlformatsOfficedocumentPresentationmlPresentation =
    'application/vnd.openxmlformats-officedocument.presentationml.presentation';

  /**
   * @description Microsoft Powerpoint files
   */
  public static ApplicationVndMsPowerpoint = 'application/vnd.ms-powerpoint';

  /**
   * @description Microsoft Word 2007 files
   */
  public static ApplicationVndOpenxmlformatsOfficedocumentWordprocessingmlDocument =
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  /**
   * @description Microsoft Word files[15]
   */
  public static ApplicationMsword = 'application/msword';

  /**
   * @description MIME Email; Defined in RFC 2045 and RFC 2046
   */
  public static MultipartAlternative = 'multipart/alternative';

  /**
   * @description MIME Email; Defined in RFC 2045 and RFC 2046
   */
  public static MultipartMixed = 'multipart/mixed';

  /**
   * @description MIME Email; Defined in RFC 2387 and used by MHTML (HTML mail)
   */
  public static MultipartRelated = 'multipart/related';

  /**
   * @description MIME Webform; Defined in RFC 2388
   */
  public static MultipartFormData = 'multipart/form-data';

  /**
   * @description Mozilla XUL files
   */
  public static ApplicationVndMozillaXulXml = 'application/vnd.mozilla.xul+xml';

  /**
   * @description MP3 or other MPEG audio; Defined in RFC 3003
   */
  public static AudioMpeg = 'audio/mpeg';

  /**
   * @description MP4 audio
   */
  public static AudioMp4 = 'audio/mp4';

  /**
   * @description MP4 video; Defined in RFC 4337
   */
  public static VideoMp4 = 'video/mp4';

  /**
   * @description MPEG-1 video with multiplexed audio; Defined in RFC 2045 and RFC 2046
   */
  public static VideoMpeg = 'video/mpeg';

  /**
   * @description MSH files, MESH files; Defined in RFC 2077, SILO files
   */
  public static ModelMesh = 'model/mesh';

  /**
   * @description mulaw audio at 8 kHz, 1 channel; Defined in RFC 2046
   */
  public static AudioBasic = 'audio/basic';

  /**
   * @description Ogg Theora or other video (with audio); Defined in RFC 5334
   */
  public static VideoOgg = 'video/ogg';

  /**
   * @description Ogg Vorbis, Speex, Flac and other audio; Defined in RFC 5334
   */
  public static AudioOgg = 'audio/ogg';

  /**
   * @description Ogg, a multimedia bitstream container format; Defined in RFC 5334
   */
  public static ApplicationOgg = 'application/ogg';

  /**
   * @description OP
   */
  public static ApplicationXopXml = 'application/xop+xml';

  /**
   * @description OpenDocument Graphics; Registered[14]
   */
  public static ApplicationVndOasisOpendocumentGraphics =
    'application/vnd.oasis.opendocument.graphics';

  /**
   * @description OpenDocument Presentation; Registered[13]
   */
  public static ApplicationVndOasisOpendocumentPresentation =
    'application/vnd.oasis.opendocument.presentation';

  /**
   * @description OpenDocument Spreadsheet; Registered[12]
   */
  public static ApplicationVndOasisOpendocumentSpreadsheet =
    'application/vnd.oasis.opendocument.spreadsheet';

  /**
   * @description OpenDocument Text; Registered[11]
   */
  public static ApplicationVndOasisOpendocumentText =
    'application/vnd.oasis.opendocument.text';

  /**
   * @description p12 files
   */
  public static ApplicationXPkcs12 = 'application/x-pkcs12';

  /**
   * @description p7b and spc files
   */
  public static ApplicationXPkcs7Certificates =
    'application/x-pkcs7-certificates';

  /**
   * @description p7c files
   */
  public static ApplicationXPkcs7Mime = 'application/x-pkcs7-mime';

  /**
   * @description p7r files
   */
  public static ApplicationXPkcs7Certreqresp =
    'application/x-pkcs7-certreqresp';

  /**
   * @description p7s files
   */
  public static ApplicationXPkcs7Signature = 'application/x-pkcs7-signature';

  /**
   * @description Portable Document Format, PDF has been in use for document exchange on the Internet since 1993; Defined in RFC 3778
   */
  public static ApplicationPdf = 'application/pdf';

  /**
   * @description Portable Network Graphics; Registered,[8] Defined in RFC 2083
   */
  public static ImagePng = 'image/png';

  /**
   * @description PostScript; Defined in RFC 2046
   */
  public static ApplicationPostscript = 'application/postscript';

  /**
   * @description QuickTime video; Registered[10]
   */
  public static VideoQuicktime = 'video/quicktime';

  /**
   * @description RAR archive files
   */
  public static ApplicationXRarCompressed = 'application/x-rar-compressed';

  /**
   * @description RealAudio; Documented in RealPlayer Customer Support Answer 2559
   */
  public static AudioVndRnRealaudio = 'audio/vnd.rn-realaudio';

  /**
   * @description Resource Description Framework; Defined by RFC 3870
   */
  public static ApplicationRdfXml = 'application/rdf+xml';

  /**
   * @description RSS feeds
   */
  public static ApplicationRssXml = 'application/rss+xml';

  /**
   * @description SOAP; Defined by RFC 3902
   */
  public static ApplicationSoapXml = 'application/soap+xml';

  /**
   * @description StuffIt archive files
   */
  public static ApplicationXStuffit = 'application/x-stuffit';

  /**
   * @description SVG vector image; Defined in SVG Tiny 1.2 Specification Appendix M
   */
  public static ImageSvgXml = 'image/svg+xml';

  /**
   * @description Tag Image File Format (only for Baseline TIFF); Defined in RFC 3302
   */
  public static ImageTiff = 'image/tiff';

  /**
   * @description Tarball files
   */
  public static ApplicationXTar = 'application/x-tar';

  /**
   * @description Textual data; Defined in RFC 2046 and RFC 3676
   */
  public static TextPlain = 'text/plain';

  /**
   * @description TrueType Font No registered MIME type, but this is the most commonly used
   */
  public static ApplicationXFontTtf = 'application/x-font-ttf';

  /**
   * @description Card (contact information); Defined in RFC 6350
   */
  public static TextVcard = 'text/vcard';

  /**
   * @description Vorbis encoded audio; Defined in RFC 5215
   */
  public static AudioVorbis = 'audio/vorbis';

  /**
   * @description WAV audio; Defined in RFC 2361
   */
  public static AudioVndWave = 'audio/vnd.wave';

  /**
   * @description Web Open Font Format; (candidate recommendation; use application/x-font-woff until standard is official)
   */
  public static ApplicationFontWoff = 'application/font-woff';

  /**
   * @description WebM Matroska-based open media format
   */
  public static VideoWebm = 'video/webm';

  /**
   * @description WebM open media format
   */
  public static AudioWebm = 'audio/webm';

  /**
   * @description Windows Media Audio Redirector; Documented in Microsoft help page
   */
  public static AudioXMsWax = 'audio/x-ms-wax';

  /**
   * @description Windows Media Audio; Documented in Microsoft KB 288102
   */
  public static AudioXMsWma = 'audio/x-ms-wma';

  /**
   * @description Windows Media Video; Documented in Microsoft KB 288102
   */
  public static VideoXMsWmv = 'video/x-ms-wmv';

  /**
   * @description WRL files, VRML files; Defined in RFC 2077
   */
  public static ModelVrml = 'model/vrml';

  /**
   * @description X3D ISO standard for representing 3D computer graphics, X3D XML files
   */
  public static ModelX3DXml = 'model/x3d+xml';

  /**
   * @description X3D ISO standard for representing 3D computer graphics, X3DB binary files
   */
  public static ModelX3DBinary = 'model/x3d+binary';

  /**
   * @description X3D ISO standard for representing 3D computer graphics, X3DV VRML files
   */
  public static ModelX3DVrml = 'model/x3d+vrml';

  /**
   * @description XHTML; Defined by RFC 3236
   */
  public static ApplicationXhtmlXml = 'application/xhtml+xml';

  /**
   * @description ZIP archive files; Registered[7]
   */
  public static ApplicationZip = 'application/zip';
}
