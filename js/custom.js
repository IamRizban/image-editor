$(function () {
    fabric.filterBackend = fabric.initFilterBackend();
    fabric.Object.prototype.transparentCorners = false;

    var $ = function (id) {
        return document.getElementById(id)
    };
    canvas = new fabric.Canvas('canvas');
    f = fabric.Image.filters;

    canvas.on({
        'object:selected': function () {
            var filters = ['brightness', 'contrast', 'noise'];
            for (var i = 0; i < filters.length; i++) {
                $(filters[i]) && ($(filters[i]).checked = !!canvas.getActiveObject().filters[i]);
            }
        }
    });

    function applyFilter(index, filter) {
        console.log(canvas);
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

    $('blackwhite').onclick = function () {
        applyFilter(19, this.checked && new f.BlackWhite());
    };
    $('brightness').onclick = function () {
        if (document.getElementById("brightness").checked) {
            document.getElementById("brightness-value").style.display = 'block';
        } else {
            document.getElementById("brightness-value").style.display = 'none';
        }
        applyFilter(5, this.checked && new f.Brightness({
            brightness: parseFloat($('brightness-value').value)
        }));
    };
    $('brightness-value').oninput = function () {
        applyFilterValue(5, 'brightness', parseFloat(this.value));
    };
    $('contrast').onclick = function () {
        if (document.getElementById("contrast").checked) {
            document.getElementById("contrast-value").style.display = 'block';
        } else {
            document.getElementById("contrast-value").style.display = 'none';
        }
        applyFilter(6, this.checked && new f.Contrast({
            contrast: parseFloat($('contrast-value').value)
        }));
    };
    $('contrast-value').oninput = function () {
        applyFilterValue(6, 'contrast', parseFloat(this.value));
    };
    $('noise').onclick = function () {
        if (document.getElementById("noise").checked) {
            document.getElementById("noise-value").style.display = 'block';
        } else {
            document.getElementById("noise-value").style.display = 'none';
        }
        applyFilter(8, this.checked && new f.Noise({
            noise: parseInt($('noise-value').value, 10)
        }));
    };
    $('noise-value').oninput = function () {
        applyFilterValue(8, 'noise', parseInt(this.value, 10));
    };
});
// save/download image
$('#imgDownload').click(function () {
    if ($('#canvas').length) {
        canvas.discardActiveObject().renderAll();
        $('#canvas').get(0).toBlob(function (blob) {
            saveAs(blob, 'cropped.jpg');
        });
        // hide canvas div
        $('#getCanvasDiv').hide();
        // show cropper div
        $('#getCroppingDiv').show();
        // disable fabric controls
        $('.fabricCheckboxes').prop('disabled', true);
        $('.fabricCheckboxes').prop('checked', false);
        $('.filtercontols').addClass('disabled');
        // enable  cropping controls
        $('.croppercontols').removeClass('disabled');
        var $image = $('#image');
        var $dataHeight = $('#dataHeight');
        var $dataWidth = $('#dataWidth');
        var options = {
            aspectRatio: 16 / 9,
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
    }
});
// delete cropped image
$('#imgDelete').click(function () {
    if ($('#canvas').length) {
        //clear canvas
        canvas.clear();
        // hide canvas div
        $('#getCanvasDiv').hide();
        // show cropper div
        $('#getCroppingDiv').show();
        // disable fabric controls
        $('.fabricCheckboxes').prop('disabled', true);
        $('.fabricCheckboxes').prop('checked', false);
        $('.filtercontols').addClass('disabled');
        // enable  cropping controls
        $('.croppercontols').removeClass('disabled');
    }
});
// disable all fabric controls
$('.fabricCheckboxes').prop('disabled', true);
// active image if user clicks on any checkbox or radio button
$('.fabricCheckboxes').click(function () {
    canvas.setActiveObject(canvas.item(0));
});
// Attach Button click event listener 
$("#showMetaDataModal").click(function () {
    // show Modal
    $('#getMetaDataModal').modal('show');
});