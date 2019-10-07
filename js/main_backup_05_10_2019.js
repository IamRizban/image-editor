imageWidth = 0;
imageHeight = 0;
var aspRatio = 16 / 9;
$(function () {
    'use strict';
    var console = window.console || {log: function () {}};
    var URL = window.URL || window.webkitURL;
    var download = document.getElementById('download');
//    var actions = document.getElementById('actions');
    var $image = $('#image');
    var $dataHeight = $('#dataHeight');
    var $dataWidth = $('#dataWidth');
//    var $imgHeight = $('#imgHeight');
//    var $imgWidth = $('#imgWidth');

    var options = {
        aspectRatio: 16 / 9,
        preview: '.img-preview',
        crop: function (e) {
            $dataHeight.val(Math.round(e.detail.height));
            $dataWidth.val(Math.round(e.detail.width));
        },
    };
    var originalImageURL = $image.attr('src');
    var uploadedImageName = 'cropped.jpg';
    var uploadedImageType = 'image/jpeg';
    var uploadedImageURL;
    // Tooltip
    $('[data-toggle="tooltip"]').tooltip();
    // Cropper
    $image.on({
        ready: function (e) {
            console.log(e.type);
        },
        cropstart: function (e) {
            console.log(e.type, e.detail.action);
        },
        cropmove: function (e) {
            console.log(e.type, e.detail.action);
        },
        cropend: function (e) {
            console.log(e.type, e.detail.action);
        },
        crop: function (e) {
            console.log(e.type);
        },
        zoom: function (e) {
            console.log(e.type, e.detail.ratio);
        }
    }).cropper(options);

    // download button script
    // Download
    if (typeof download.download === 'undefined') {
        download.className += ' disabled';
        download.title = 'Your browser does not support download';
    }
    // change height & width of cropper
    $('#dataWidth, #dataHeight').keyup(function () {

        if (($('.aspect_ratio.active').find(':radio').attr('id') == 'aspectRatio1') || ($('.aspect_ratio.active').find(':radio').attr('id') == 'aspectRatio2')) {
            aspRatio = 16 / 9;
        } else if ($('.aspect_ratio.active').find(':radio').attr('id') == 'aspectRatio3') { // 1:1 Ratio
            aspRatio = 1 / 1;
        } else if ($('.aspect_ratio.active').find(':radio').attr('id') == 'aspectRatio4') { // 9:16 Ratio
            aspRatio = 9 / 16;
        } else if ($('.aspect_ratio.active').find(':radio').attr('id') == 'aspectRatio5') { // 9:16 Ratio
            aspRatio = null;
        }

        var options = {
            aspectRatio: aspRatio,
            preview: '.img-preview',
            crop: function (e) {
                $dataHeight.val(Math.round(e.detail.height));
                $dataWidth.val(Math.round(e.detail.width));
            },
            data: {
                width: parseInt($('#dataWidth').val()),
                height: parseInt($('#dataHeight').val()),
            }
        };
        $image.cropper('destroy').cropper(options);
    });
    // change height & width of image
//    $('#imgWidth, #imgHeight').keyup(function () {
////        var options = {
////            aspectRatio: 16 / 9,
////            preview: '.img-preview',
////            crop: function (e) {
////                $dataHeight.val(Math.round($imgHeight.val()));
////                $dataWidth.val(Math.round($imgWidth.val()));
////            },
////            data: {
////                width: parseInt($imgWidth.val()),
////                height: parseInt($imgHeight.val()),
////            }
////        };
//
//        $image.attr('height', parseInt($imgHeight.val()));
//        $image.attr('width', parseInt($imgWidth.val()));
//        // set width
//        $('.cropper-view-box img').width(parseInt($imgWidth.val()));
//        $('.cropper-hide').width(parseInt($imgWidth.val()));
//        // set height
//        $('.cropper-view-box img').height(parseInt($imgHeight.val()));
//        $('.cropper-hide').height(parseInt($imgHeight.val()));
////        $image.cropper('destroy').cropper(options);
//    });
    // Buttons
    if (!$.isFunction(document.createElement('canvas').getContext)) {
        $('button[data-method="getCroppedCanvas"]').prop('disabled', true);
    }
    if (typeof document.createElement('cropper').style.transition === 'undefined') {
        $('button[data-method="rotate"]').prop('disabled', true);
        $('button[data-method="scale"]').prop('disabled', true);
    }

    // Change aspect ratio
//    $('.docs-toggles').on('change', function (event) {
//        var e = event || window.event;
//        var cropper = $image.data('cropper');
//        var target = e.target || e.srcElement;
//        var cropBoxData;
//        var canvasData;
//        var isCheckbox;
//        var isRadio;
//
//        if (!cropper) {
//            return;
//        }
//
//        if (target.tagName.toLowerCase() === 'label') {
//            target = target.querySelector('input');
//        }
//
//        isCheckbox = target.type === 'checkbox';
//        isRadio = target.type === 'radio';
//
//        if (isCheckbox || isRadio) {
//            if (isCheckbox) {
//                options[target.name] = target.checked;
//                cropBoxData = cropper.getCropBoxData();
//                canvasData = cropper.getCanvasData();
//
//                options.ready = function () {
//                    console.log('ready');
//                    cropper.setCropBoxData(cropBoxData).setCanvasData(canvasData);
//                };
//            } else {
//                options[target.name] = target.value;
//                options.ready = function () {
//                    console.log('ready');
//                };
//            }
//            // Reinitialize
//            $image.cropper('destroy').cropper(options);
//        }
//    });
    $('.docs-toggles').on('change', 'input', function () {
        var $this = $(this);
        var name = $this.attr('name');
        var type = $this.prop('type');
        var cropBoxData;
        var canvasData;
        if (!$image.data('cropper')) {
            return;
        }
        if (type === 'checkbox') {
            options[name] = $this.prop('checked');
            cropBoxData = $image.cropper('getCropBoxData');
            canvasData = $image.cropper('getCanvasData');
            options.ready = function () {
                $image.cropper('setCropBoxData', cropBoxData);
                $image.cropper('setCanvasData', canvasData);
            };
        } else if (type === 'radio') {
            options[name] = $this.val();
        }
        $image.cropper('destroy').cropper(options);
    });

    // Methods
    $('.docs-buttons').on('click', '[data-method]', function () {
        var $this = $(this);
        var data = $this.data();
        var cropped;
        var cropper = $image.data('cropper');
        var $target;
        var result;
        if ($this.prop('disabled') || $this.hasClass('disabled')) {
            return;
        }
        if (cropper && data.method) {
            data = $.extend({}, data); // Clone a new one
            if (typeof data.target !== 'undefined') {
                $target = $(data.target);
                if (typeof data.option === 'undefined') {
                    try {
                        data.option = JSON.parse($target.val());
                    } catch (e) {
                        console.log(e.message);
                    }
                }
            }
            cropped = cropper.cropped;
            switch (data.method) {
                case 'rotate':
                    if (cropped && options.viewMode > 0) {
                        $image.cropper('clear');
                    }
                    break;
                case 'getCroppedCanvas':
                    if (uploadedImageType === 'image/jpeg') {
                        if (!data.option) {
                            data.option = {};
                        }
                        data.option.fillColor = '#fff';
                    }
                    break;
            }
            result = $image.cropper(data.method, data.option, data.secondOption);
            switch (data.method) {
                case 'rotate':
                    if (cropped && options.viewMode > 0) {
                        $image.cropper('crop');
                    }
                    break;
                case 'scaleX':
                case 'scaleY':
                    $(this).data('option', -data.option);
                    break;
                case 'getCroppedCanvas':
                    if (result) {
                        // get active aspect ratio                        
                        // hide cropper, enable canvas to applied filters
                        $('#getCroppingDiv').hide();
                        $('#getCanvasDiv').show().find('.croppedImgDiv').html(result);
                        // enable all fabric controls
                        $('.fabricCheckboxes').prop('disabled', false);
                        $('.filtercontols').removeClass('disabled');
                        // disable all cropper controls
                        $('.croppercontols').addClass('disabled');
                        // add download link to download button
                        if (!download.disabled) {
                            download.download = uploadedImageName;
                            download.href = result.toDataURL(uploadedImageType);
                        }
                        /** ==================== Start of enable fabric js code ============================== **/
                        $('canvas').attr('id', 'canvas');
                        var dataURL = result.toDataURL(uploadedImageType);
                        canvas = new fabric.Canvas('canvas');
                        // get height & width of cropped image
                        $("body").append("<img style='display:none;' id='hiddenImage' src='" + dataURL + "' />");
                        // show loader
                        $("div#divLoading").addClass('show');
                        setTimeout(function () {
                            imageWidth = $('#hiddenImage').width();
                            imageHeight = $('#hiddenImage').height();
                            $('#hiddenImage').remove();
                            // if only image width is less than 1200 or height less than 675, make blur image with duplicate image
                            if (imageWidth < 1200 || imageHeight < 675) {
                                // first draw blur image
                                canvas.setWidth(1200).setHeight(675);
                                fabric.Image.fromURL(dataURL, function (img) {
                                    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
                                        scaleX: canvas.width / img.width,
                                        scaleY: canvas.height / img.height
                                    });
                                    canvas.add(img).centerObject(img).setActiveObject(img).renderAll();

                                    // blur background image
                                    applyFilter(11, new f.Blur({
                                        value: parseFloat(0.8)
                                    }));
                                    applyFilterValue(11, 'blur', parseFloat(0.8, 10));
                                    // decrease brighness of background image
                                    applyFilter(5, new f.Brightness({
                                        brightness: parseFloat(0.101801)
                                    }));
                                    applyFilterValue(5, 'brightness', parseFloat(-0.123456));
                                });
                                // then draw original image on center position of blur image
                                fabric.Image.fromURL(dataURL, function (oImg) {
                                    canvas.add(oImg).centerObject(oImg).setActiveObject(oImg).renderAll();
                                });
                            } else { // else just draw original cropped image
                                fabric.Image.fromURL(dataURL, function (img) {
                                    // aspect ratio conditions
                                    // 16:9 OR 4:3 Ratio
                                    if (($('.aspect_ratio.active').find(':radio').attr('id') == 'aspectRatio1') || ($('.aspect_ratio.active').find(':radio').attr('id') == 'aspectRatio2')) {
                                        canvas.setWidth(1200).setHeight(675);
                                    } else if ($('.aspect_ratio.active').find(':radio').attr('id') == 'aspectRatio3') { // 1:1 Ratio
                                        canvas.setWidth(1200).setHeight(1200);
                                    } else if ($('.aspect_ratio.active').find(':radio').attr('id') == 'aspectRatio4') { // 9:16 Ratio
                                        canvas.setWidth(675).setHeight(1200);
                                    }

                                    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
                                        scaleX: canvas.width / img.width,
                                        scaleY: canvas.height / img.height
                                    });
                                    canvas.add(img).centerObject(img).setActiveObject(img).renderAll();
                                });
                            }
                            /** ==================== End of enable fabric js code ============================== **/
                            // hide loader
                            $("div#divLoading").removeClass('show');
                        }, 1000);
                    }
                    break;
                case 'destroy':
                    if (uploadedImageURL) {
                        URL.revokeObjectURL(uploadedImageURL);
                        uploadedImageURL = '';
                        $image.attr('src', originalImageURL);
                    }
                    break;
            }
            if ($.isPlainObject(result) && $target) {
                try {
                    $target.val(JSON.stringify(result));
                } catch (e) {
                    console.log(e.message);
                }
            }
        }
    });
    // Keyboard
    $(document.body).on('keydown', function (e) {
        if (e.target !== this || !$image.data('cropper') || this.scrollTop > 300) {
            return;
        }
        switch (e.which) {
            case 37:
                e.preventDefault();
                $image.cropper('move', -1, 0);
                break;
            case 38:
                e.preventDefault();
                $image.cropper('move', 0, -1);
                break;
            case 39:
                e.preventDefault();
                $image.cropper('move', 1, 0);
                break;
            case 40:
                e.preventDefault();
                $image.cropper('move', 0, 1);
                break;
        }
    });
    // Import image
    var $inputImage = $('#inputImage');
    if (URL) {
        $inputImage.change(function () {
            //clear canvas
            canvas.clear();
            // disable fabric contols
            $('.fabricCheckboxes').prop('disabled', true);
            $('.fabricCheckboxes').prop('checked', false);
            $('.filtercontols').addClass('disabled');
            // enable  cropping controls
            $('.croppercontols').removeClass('disabled');
            $('#getCanvasDiv').hide();
            $('#getCroppingDiv').show();
            var files = this.files;
            var file;
            if (!$image.data('cropper')) {
                return;
            }
            if (files && files.length) {
                file = files[0];
                if (/^image\/\w+$/.test(file.type)) {
                    uploadedImageName = file.name;
                    uploadedImageType = file.type;
                    if (uploadedImageURL) {
                        URL.revokeObjectURL(uploadedImageURL);
                    }
                    uploadedImageURL = URL.createObjectURL(file);
                    $image.cropper('destroy').attr('src', uploadedImageURL).cropper(options);
                    $inputImage.val('');
                } else {
                    window.alert('Please choose an image file.');
                }
                // to get IPTC information of an image
                getExif(file);
            }
        });
    } else {
        $inputImage.prop('disabled', true).parent().addClass('disabled');
    }

    // get iptc & exif (metadata) information of an image
    function getExif(file) {
        EXIF.getData(file, function () {
            var allMetaData = EXIF.getAllTags(this);
            var allMetaDataSpan = document.getElementById("allMetaDataSpan");
            var allMetaDataString = JSON.stringify(allMetaData);
            var allMetaDataJSON = JSON.parse(allMetaDataString);
            if (isEmpty(allMetaDataJSON)) {
                var table = '<table class="table table-responsive table-bordered"><tbody><tr class="table-secondary"><td>No information available</td></tr></tbody>';
                allMetaDataSpan.innerHTML = table;
            } else {
                var description, dateTime = '';
                if (allMetaDataJSON.ImageDescription !== undefined) {
                    description = allMetaDataJSON.ImageDescription;
                } else {
                    description = 'No information available';
                }
                if (allMetaDataJSON.DateTime !== undefined) {
                    dateTime = allMetaDataJSON.DateTime;
                } else {
                    dateTime = 'No information available';
                }
                var table = '<table class="table table-responsive table-bordered"><tbody>\n\
                        <tr class="table-secondary"><td>Description</td><td>' + description + '</td></tr>\n\
                        <tr class="table-secondary"><td>Date Time</td><td>' + dateTime + '</td></tr></tbody>';
                allMetaDataSpan.innerHTML = table;
            }
        });
    }

    function isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

});

filters = ['blur', 'brightness'];

function applyFilter(index, filter) {
    var obj = canvas.getActiveObject();
    obj.filters[index] = filter;
    obj.applyFilters();
    canvas.renderAll();
}

function applyFilterValue(index, prop, value) {
    var obj = canvas.getActiveObject();
    if (obj.filters[index]) {
        obj.filters[index][prop] = value;
        obj.applyFilters();
        canvas.renderAll();
    }
}
