/*
Author : Sumanth Paranjape
id:      sparanj2@asu.edu
College: ASU
*/

var index = 0;
var time = 0;
var step = -8;
 
 /*
    Returns the configuration parameters required for plotting the
    Sinusoidal wave. "amplitudes" consists of the data to be plotted.
 */
 function loadJSON(){
     let plotParams = {
          "x" : 4,
          "y" : 0,
          "amplitude" : 40,
          "amplitudes" : [],
          "itr" : 0,
          "frequency" : 20,
          "sinVal" : 0.0,
          "sinNext" : 0.0,
          "rounded" : 0.0,
          "roundedNext" : 0.0
     };
     
     return plotParams;
 }
 
/*
    JSON object which stores the configuration parameters to be 
    used globally for skipping frames while rendering, therby 
    controlling the frames per second rendered. Desired FPS
    can be assigned to the "fps" parameter.
*/
 var fps_controller = {
     "fps": 0,
     "fpsInterval": 0,
     "startTime": 0,
     "now": 0,
     "then": 0,
     "elapsed": 0
 };
 
/*
    Returns a random number between 0 and max inclusive.
*/
 function getRandomInt(max) {
     return Math.floor(Math.random() * Math.floor(max));
 }
 
/*
    Returns random array of desired size.
*/
 function getRandomArray(size, paramList){
     for(i=0; i<size; i++){
        paramList.amplitudes[i] = getRandomInt(150);
     }
     return paramList;
 }
 
/*Draws the line which oscillates with the sine
  wave  as an indicator for the oscillating values.
*/
 function tracePoint(ctx, y) {     
     var radius = 3;
     ctx.beginPath();

     // Hold x constant at 4 so the point only moves up and down.
     ctx.arc(4, y, radius, 0, 2 * Math.PI, false);

     ctx.fillStyle = 'red';
     ctx.fill();
     ctx.lineWidth = 1;
     ctx.stroke();
 }
 
/*
    Draws a Sine Wave with adjusted amplitude value at each direction 
    change. The amplitude values represent the dataset stored in plotParams
    object, which contains all configuration data for plotting the wave.
*/
 function plotSineWave(ctx, xOffset, yOffset) {
     var width = ctx.canvas.width;
     var height = ctx.canvas.height;
     var scale = 20;
     let plotParams = loadJSON();
     //Assign random dataset of size 100.
     plotParams = getRandomArray(size=100, plotParams);
     
     
     ctx.beginPath();
     ctx.lineWidth = 2;
     ctx.strokeStyle = "rgb(205,92,92)";//Color redIndian
     ctx.moveTo(plotParams.x, 200);
     
     //till end of canvas width.
     while (plotParams.x < width) {
          plotParams.sinVal = Math.sin((plotParams.x+xOffset)/plotParams.frequency);
          plotParams.sinNext = Math.sin((plotParams.x+1+xOffset)/plotParams.frequency);
          plotParams.rounded = Math.round((plotParams.sinVal + Number.EPSILON) * 10) / 10;
          plotParams.roundedNext = Math.round((plotParams.sinNext + Number.EPSILON) * 10) / 10;
          if(plotParams.rounded == 0.0 && plotParams.roundedNext != 0.0){
          /*Checks the point where sinValue changes from 0.0 to 0.1 or -0.1 and picks 
            the next amplitude from the amplitudes vector. */
            plotParams.amplitude = plotParams.amplitudes[plotParams.itr%100];
            plotParams.itr++;
            time++;
            document.getElementById("logArea").innerHTML += "Peak: "+plotParams.amplitude+" at time="+time+"\n";
          }
          y = height/2 + plotParams.amplitude * plotParams.sinVal;
          ctx.lineTo(plotParams.x, y);
          plotParams.x++;
     }
						
     ctx.stroke();
     ctx.save();
     //draw sine wave tracing point.
     tracePoint(ctx, y);
     ctx.stroke();
     ctx.restore();
 }
 
/*
    Creates Grid Lines on the canvas starting at (0,0).
    Scans the entire canvas based on Canvas Size(800,400).
    Offset for x-axis is 80. Offset for y-axis is 40.
    It plots 10 lines on each axis.
*/
 function createGridLines(context, canvas){
     let x1 = 0, y1 = 0;
     let x2 = 0, y2 = 400;
     let height = canvas.height, width = canvas.width;
     context.beginPath();
     context.lineWidth = 0.5;
     context.fillStyle = 'darkgrey';
     context.fill();
     
     //Creates Vertical lines. Only X changes.
     while(x1 <= width){
          x1 += 80; x2 +=80
          context.moveTo(x1, y1);
          context.lineTo(x2, y2);
     }
     
     context.stroke();
     context.save();
     
     x1 = 0, y1 = 0, x2 = 800, y2 = 0
     //Creates horizontal lines. Only Y changes.
     while(y1 <= width){
          y1 += 40; y2 +=40
          context.moveTo(x1, y1);
          context.lineTo(x2, y2);
     }
     
     context.stroke();
     context.save();
 }
 
/*
    Create X-Axis Labels. [time]
*/
 function createXLables(context, canvas, time){
     if(undefined == time || NaN == time)
            return;
     var x = 10, t = 0;
     context.fillStyle = 'darkgrey';
     context.fill();
     context.font = '12px serif';
     var width = canvas.width;
     while(x <= width){
          context.fillText(time,x, 10);
          time += 1;
          x+=80
     }
 } 
 
/*
    Create Y-Axis Labels. [Amplitudes]
*/
 function createYLables(context, canvas){
     var y = 10, t = 200;
     context.strokeStyle = "darkgrey";
     context.font = '12px Calibri';
     var height = canvas.height;
     while(y <= height){
          context.fillText(t,10, y);
          t -= 20;
          y+=20;
     }
 } 
 
/*
    Stop animation, called on Stop button.
*/
 function stop(){
     cancelAnimationFrame(animationID);
     document.getElementById("logArea").innerHTML = "";
     var canvas = document.getElementById("canvas");
     var context = canvas.getContext("2d");
     context.clearRect(0, 0, 800, 400);
     createXLables(context, canvas);
     createYLables(context, canvas);
     createGridLines(context, canvas);
 }
 
/*
    Main function for drawing X-Y Grid, X-Label and Y-Label
    and controlling the rendering of frames per seconds. 
    Draws the sine wave on the canvas and redraws it at each 
    iteration(upto 100).
*/
 function draw() {
     
     if(index <= 100){
            animationID = window.requestAnimationFrame(draw);   
     }else{
            //Stops the animation after 100 iterations
            cancelAnimationFrame(animationID);
     }
     
     fps_controller.now = Date.now();
     fps_controller.elapsed = fps_controller.now-fps_controller.then;
     
     //Only renders frames whose elased time is greater than FPS interval.
     if(fps_controller.elapsed > fps_controller.fpsInterval){
  
          fps_controller.then = fps_controller.now-(fps_controller.elapsed%fps_controller.fpsInterval);
          var canvas = document.getElementById("canvas");
          var context = canvas.getContext("2d");


          index += 1;
          //Clear contents and redraw everything.
          context.clearRect(0, 0, 800, 400);

          createXLables(context, canvas, time);
          createYLables(context, canvas);
          createGridLines(context, canvas);    

          plotSineWave(context, step, 50);
          context.restore();
          
          step += 8;
          index += 1;
     }
 }
 
/*
    Init() function initializes fps_controller object and performs first 
    request to draw() function.
*/
 function init() {
     index = 0;
     time = 0;
     fps_controller.fps = 3;
     fps_controller.fpsInterval = 1000/fps_controller.fps;
     fps_controller.then = Date.now();
     fps_controller.startTime = fps_controller.then;

     var animationID = window.requestAnimationFrame(draw);
 }