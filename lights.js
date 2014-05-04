(function () {
    "use strict";
    var dynamic_canvas = document.getElementById("dynamic"),
        dynamic_context = dynamic_canvas.getContext("2d"),

        objects_canvas = document.getElementById("objects"),
        objects_context = objects_canvas.getContext("2d"),

        width = dynamic_canvas.width,
        height = dynamic_canvas.height,
        lightX = 0, 
        lightY = 0, 
        ligthList = [],
        distance, 
        pix,
        lastCalledTime,
        fps;

    function Light(x, y) {
        var i,
            j,
            curX,
            curY,
            pos;

        this.x = x;
        this.y = y;
        this.distance = Math.random() * 15 + 155;
        this.shape = [];

        for (i = 0; i < 360; i++) {
            redo:
            for (j = 0; j < this.distance; j++) {
                curX = Math.round(this.x + j * Math.cos(i * Math.PI / 180));
                curY = Math.round(this.y + j * Math.sin(i * Math.PI / 180));

                pos = (width * curY + curX) * 4;
                if (pix[pos] !== 0) {
                    this.shape.push({x: curX, y: curY});
                    break redo;
                }
            }
            this.shape.push({x: curX, y: curY});
        }

        this.getRadgrad = function () {
            this.radgrad = dynamic_context.createRadialGradient(x, y, 0, x, y, this.distance);
            this.radgrad.addColorStop(0, 'rgba(255,255,255,1)');
            this.radgrad.addColorStop(0.33, 'rgba(255,255,255,0.5)');
            this.radgrad.addColorStop(0.85+Math.random() * 0.10, 'rgba(255,255,255,0)');
            return this.radgrad;
        };

        this.drawLight = function () {
            var i, 
                size = this.shape.length;

            dynamic_context.beginPath();
            dynamic_context.fillStyle = this.getRadgrad();
            for (i = 0; i < size; i++) {
                dynamic_context.lineTo(this.shape[i].x, this.shape[i].y);
            }
            dynamic_context.fill();
        };
    }

    function requestAnimFrame() {
        if(!lastCalledTime) {
            lastCalledTime = new Date().getTime();
            fps = 0;
          return;
        }
        var delta = (new Date().getTime() - lastCalledTime)/1000;
        lastCalledTime = new Date().getTime();
        fps = 1/delta;
        document.getElementById("debug").innerHTML = fps;
    } 

    function load() {
        var k, currLight;
        dynamic_context.clearRect(0, 0, width, height);
        for (k = 0; k < ligthList.length; k++) {
            ligthList[k].drawLight();
        }

        currLight = new Light(lightX, lightY);
        currLight.drawLight();
        requestAnimFrame();
    }

    objects_context.fillStyle = '#000';
    objects_context.lineWidth = 1;
    objects_context.fillRect(0, 0, width, height);

    objects_context.beginPath();
    objects_context.fillStyle = "#010000";
    objects_context.fillRect(100, 25, 50, 50);

    objects_context.fillRect(100, 250, 100, 10);

    objects_context.arc(750, 150, 75, 0, Math.PI * 2, true);
    objects_context.fill();

    objects_context.arc(300, 525, 100, 0, Math.PI * 2, true);
    objects_context.fill();

    objects_context.font = "90px sans-serif";
    objects_context.fillText("sens caché", 200, 300);

    objects_context.fillRect(700, 300, 10, 250);

    pix = objects_context.getImageData(0, 0, width, height).data;

    dynamic_canvas.addEventListener('click', function (e) {
        if (ligthList.length < 50) {
            ligthList.push(new Light(e.clientX, e.clientY));
        }
    });

    dynamic_canvas.addEventListener('mousemove', function (e) {
        lightX = e.clientX;
        lightY = e.clientY;
    });

    setInterval(load, 0);
}());