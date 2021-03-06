// Get the 3D-scene-containing element.
var three_container = document.getElementById('three-test');

// Only run the 3D code if the container element is present.
if ( typeof three_container != 'undefined' ) {

    // Fire init() when the page has loaded. 
    window.addEventListener('load', init, false);

}

// Declare some reuseable colours.
var colours = {
    red:0xf25346,
    white:0xd8d0d1,
    brown:0x59332e,
    pink:0xF5986E,
    brownDark:0x23190f,
    blue:0x00b7c6,
    fog:0xefeeeb
};

var plane;

// Manage all the 3D functions with an initialization function.
function init() {
    // set up the scene, the camera and the renderer
    createScene(three_container);

    // add the lights
    createLights();

    // add the objects
    // createPlane();
    createSea();
    // createSphere();
    plane = createPlane();
    pulse_plane(plane);
    // createSky();

    // start a loop that will update the objects' positions 
    // and render the scene on each frame
    loop();

    // Add an orbit control which allows us to move around the scene. See the three.js example for more details
    // https://github.com/mrdoob/three.js/blob/dev/examples/js/controls/OrbitControls.
    // var controls = new THREE.OrbitControls( camera, renderer.domElement );
    // controls.addEventListener( 'change', function() { renderer.render(scene, camera); } ); // add this only if there is no animation loop (requestAnimationFrame)
}

var scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH, renderer;

function createScene(container) {
    // Get the width and the height of the screen,
    // use them to set up the aspect ratio of the camera 
    // and the size of the renderer.
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    // Create the scene
    scene = new THREE.Scene();

    // Add a fog effect to the scene; same color as the
    // background color used in the style sheet
    // scene.fog = new THREE.Fog(colours.blue, 100, 950);
    
    // Create the camera
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 60;
    nearPlane = 1;
    farPlane = 10000;
    camera = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearPlane,
        farPlane
        );
    
    // Set the position of the camera
    camera.position.x = 0;
    camera.position.z = 500;
    camera.position.y = 300;
    
    // Create the renderer
    renderer = new THREE.WebGLRenderer({ 
        // Allow transparency to show the gradient background
        // we defined in the CSS
        alpha: true, 

        // Activate the anti-aliasing; this is less performant,
        // but, as our project is low-poly based, it should be fine :)
        antialias: true 
    });

    // Define the size of the renderer; in this case,
    // it will fill the entire screen
    renderer.setSize(WIDTH, HEIGHT);
    
    // Enable shadow rendering
    renderer.shadowMap.enabled = true;
    
    // Add the DOM element of the renderer to the 
    // container we created in the HTML
    // container = document.getElementById('world');
    container.appendChild(renderer.domElement);
    
    // Listen to the screen: if the user resizes it
    // we have to update the camera and the renderer size
    window.addEventListener('resize', handleWindowResize, false);
}

function handleWindowResize() {
    // update height and width of the renderer and the camera
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}

var hemisphereLight, shadowLight, pointLight;

function createLights() {
    // A hemisphere light is a gradient colored light; 
    // the first parameter is the sky color, the second parameter is the ground color, 
    // the third parameter is the intensity of the light
    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)
    
    // A directional light shines from a specific direction. 
    // It acts like the sun, that means that all the rays produced are parallel. 
    shadowLight = new THREE.DirectionalLight(0xffffff, .9);

    // Set the direction of the light  
    shadowLight.position.set(50, 0, 0);
    
    // Allow shadow casting 
    shadowLight.castShadow = true;

    // define the visible area of the projected shadow
    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;

    // define the resolution of the shadow; the higher the better, 
    // but also the more expensive and less performant
    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;

    pointLight = new THREE.DirectionalLight(0xffffff, .6);
    pointLight.position.set(100, 100, 0);
    pointLight.castShadow = true;
    pointLight.shadow.camera.left = -400;
    pointLight.shadow.camera.right = 400;
    pointLight.shadow.camera.top = 400;
    pointLight.shadow.camera.bottom = -400;
    pointLight.shadow.camera.near = 1;
    pointLight.shadow.camera.far = 1000;
    pointLight.shadow.mapSize.width = 2048;
    pointLight.shadow.mapSize.height = 2048;

    
    // to activate the lights, just add them to the scene
    scene.add(hemisphereLight);  
    scene.add(shadowLight);
    scene.add(pointLight);
}

var sea_radius = 5000;
var sea_distance = 1000;

Sea = function(){

    var geom = new THREE.CylinderGeometry(
        // Top radius
        sea_radius,
        // Bottom radius
        sea_radius,
        // Height
        sea_distance,
        // Vertical vertices
        (sea_radius/sea_distance)*50,
        // Horizontal vertices
        (sea_radius/sea_distance)*10,
        // openEnded
        true
        );
    geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));

    // important: by merging vertices we ensure the continuity of the waves
    geom.mergeVertices();

    // get the vertices
    var l = geom.vertices.length;

    // create an array to store new data associated to each vertex
    this.waves = [];

    for (var i=0; i<l; i++){
        // get each vertex
        var v = geom.vertices[i];

        // store some data associated to it
        this.waves.push({
            y:v.y,
            x:v.x,
            z:v.z,
            // a random angle
            ang:Math.random()*Math.PI*2,
            // a random distance
            amp:5 + Math.random()*15,
            // a random speed between 0.016 and 0.048 radians / frame
            speed:0.016 + Math.random()*0.032
        });
    };
    var mat = new THREE.MeshPhongMaterial({
        color:colours.blue,
        // transparent:true,
        // opacity:.8,
        shading:THREE.FlatShading,
        // wireframe:true
    });

    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.receiveShadow = true;

}

// now we create the function that will be called in each frame 
// to update the position of the vertices to simulate the waves

Sea.prototype.moveWaves = function (){
    
    // get the vertices
    var verts = this.mesh.geometry.vertices;
    var l = verts.length;
    
    for (var i=0; i<l; i++){
        var v = verts[i];
        
        // get the data associated to it
        var vprops = this.waves[i];
        
        // update the position of the vertex
        v.x = vprops.x + Math.cos(vprops.ang)*vprops.amp;
        v.y = vprops.y + Math.sin(vprops.ang)*vprops.amp;

        // increment the angle for the next frame
        vprops.ang += vprops.speed;

    }

    // Tell the renderer that the geometry of the sea has changed.
    // In fact, in order to maintain the best level of performance, 
    // three.js caches the geometries and ignores any changes
    // unless we add this line
    this.mesh.geometry.verticesNeedUpdate=true;

    sea.mesh.rotation.z += .0001;
}

// Instantiate the sea and add it to the scene:

var sea;

function createSea(){
    sea = new Sea();

    // push it a little bit at the bottom of the scene
    sea.mesh.position.y = -sea_radius;

    // add the mesh of the sea to the scene
    scene.add(sea.mesh);
}

function loop(){
    // Rotate the propeller, the sea and the sky
    // airplane.propeller.rotation.x += 0.3;
    // sea.mesh.rotation.z += .05;
    sea.moveWaves();

    plane_object.rotation.x += .005;
    plane_object.rotation.y += .005;
    plane_object.rotation.z += .005;
    
    // sphere.mesh.rotation.x += .005;
    // sphere.mesh.rotation.y += .005;
    // sphere.mesh.rotation.z += .005;
    // sphere.moveWaves();
    // plane.moveWaves();
    // pulse_plane(plane);
    // sky.mesh.rotation.z += .01;

    // render the scene
    renderer.render(scene, camera);

    // call the loop function again
    requestAnimationFrame(loop);
}

Sphere = function(){

    var geom = new THREE.SphereGeometry(64,12,12);
    geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));

    // important: by merging vertices we ensure the continuity of the waves
    geom.mergeVertices();

    // get the vertices
    var l = geom.vertices.length;

    // create an array to store new data associated to each vertex
    this.waves = [];

    for (var i=0; i<l; i++){
        // get each vertex
        var v = geom.vertices[i];

        // store some data associated to it
        this.waves.push({
            y:v.y,
            x:v.x,
            z:v.z,
            // a random angle
            ang:Math.random()*Math.PI*2,
            // a random distance
            amp:5 + Math.random()*15,
            // a random speed between 0.016 and 0.048 radians / frame
            speed:0.016 + Math.random()*0.032
        });
    };
    var mat = new THREE.MeshPhongMaterial({
        color:colours.blue,
        shading:THREE.FlatShading
    });

    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.receiveShadow = true;

}

function createSphere(){
    sphere = new Sphere();

    // push it a little bit at the bottom of the scene
    sphere.mesh.position.set(0, 150, -100);

    sphere.mesh.receiveShadow = true;
    sphere.mesh.castShadow = true;

    // add the mesh of the sea to the scene
    scene.add(sphere.mesh);
}

Sphere.prototype.moveWaves = function (){
    
    // get the vertices
    var verts = this.mesh.geometry.vertices;
    var l = verts.length;
    
    for (var i=0; i<l; i++){
        var v = verts[i];

        if ( i == 0 ) {
            console.log(this.waves[i]);
        }
        
        // get the data associated to it
        var vprops = this.waves[i];
        
        // update the position of the vertex
        v.x = vprops.x + ( 0.5 * Math.cos(vprops.ang)*vprops.amp );
        v.y = vprops.y + ( 0.5 * Math.sin(vprops.ang)*vprops.amp );
        // v.x = vprops.x + vprops.ang*vprops.amp;
        // v.y = vprops.y + vprops.ang*vprops.amp;

        // increment the angle for the next frame
        vprops.ang += vprops.speed;

    }

    // Tell the renderer that the geometry of the sea has changed.
    // In fact, in order to maintain the best level of performance, 
    // three.js caches the geometries and ignores any changes
    // unless we add this line
    this.mesh.geometry.verticesNeedUpdate=true;

    this.mesh.rotation.x += .005;
    this.mesh.rotation.y += .005;
    this.mesh.rotation.z += .005;
}

// Plane = function(){

//     var geom = new THREE.PlaneGeometry(64,64,32,32);
//     geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));



//     // important: by merging vertices we ensure the continuity of the waves
//     geom.mergeVertices();

//     // get the vertices
//     var l = geom.vertices.length;

//     // create an array to store new data associated to each vertex
//     this.waves = [];

//     for (var i=0; i<l; i++){
//         // get each vertex
//         var v = geom.vertices[i];

//         // store some data associated to it
//         this.waves.push({
//             y:v.y,
//             x:v.x,
//             z:v.z,
//             // a random angle
//             ang:Math.random()*Math.PI*2,
//             // a random distance
//             amp:5 + Math.random()*15,
//             // a random speed between 0.016 and 0.048 radians / frame
//             speed:0.016 + Math.random()*0.032
//         });
//     };
//     var mat = new THREE.MeshPhongMaterial({
//         color:colours.blue,
//         shading:THREE.FlatShading,
//         side:THREE.DoubleSide
//     });
//     this.mesh = new THREE.Mesh(geom, mat);
//     this.mesh.receiveShadow = true;

// }

function createPlane() {
    // plane = new Plane();

    // // push it a little bit at the bottom of the scene
    // plane.mesh.position.set(0, 150, -100);

    // plane.mesh.receiveShadow = true;
    // plane.mesh.castShadow = true;

    // // add the mesh of the sea to the scene
    // scene.add(plane.mesh);
    
    // plane_object
    plane_object = new THREE.Object3D();
    scene.add( plane_object );

    var point_count = 6;

    var side_one_geometry = new THREE.PlaneGeometry(256,256,point_count,point_count);

    var side_two_geometry = new THREE.PlaneGeometry(256,256,point_count,point_count);
    side_two_geometry.applyMatrix( new THREE.Matrix4().makeRotationY( Math.PI ) );

    var material = new THREE.MeshPhongMaterial({
        color:colours.red,
        shading:THREE.FlatShading,
        side:THREE.DoubleSide
    });

    // mesh
    mesh1 = new THREE.Mesh( side_one_geometry, material );
    mesh1.receiveShadow = true;
    mesh1.castShadow = true;
    plane_object.add( mesh1 );
    
    mesh2 = new THREE.Mesh( side_two_geometry, material );
    // mesh2.receiveShadow = true;
    mesh2.castShadow = true;
    plane_object.add( mesh2 );

    plane_object.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));

    mesh2.position.set(0, 0, -1);

    plane_object.position.set(0, 100, -100);

    return plane_object;


}

function pulse_plane( plane ) {
    var target_1 = plane.children[0];
    var target_2 = plane.children[1];
    var vertices_1 = target_1.geometry.vertices;
    var vertices_2 = target_2.geometry.vertices;

    for ( var i = 0; i < vertices_1.length; i++ ){
        var v = vertices_1[i];
        var v2 = vertices_2[vertices_1.length - (i + 1)];
        
        // get the data associated to it
        // var vprops = this.waves[i];
        
        // update the position of the vertex
        // var rand = Math.random() * 100;
        // v.z = (v.z / 2 ) + (rand / 2);//vprops.x + Math.cos(vprops.ang)*vprops.amp;
        // v2.z = (v2.z / 2 ) + (rand / 2);

        v.z = 2 * i;
        // v2.z = 2 * i;
        // v.y = vprops.y + Math.sin(vprops.ang)*vprops.amp;

        // increment the angle for the next frame
        // vprops.ang += vprops.speed;

    }

    // Tell the renderer that the geometry of the sea has changed.
    // In fact, in order to maintain the best level of performance, 
    // three.js caches the geometries and ignores any changes
    // unless we add this line
    target_1.geometry.verticesNeedUpdate=true;
    target_2.geometry.verticesNeedUpdate=true;
}

// Plane.prototype.moveWaves = function (){
    
//     // get the vertices
//     var verts = this.mesh.geometry.vertices;
//     var l = verts.length;
    
//     for (var i=0; i<l; i++){
//         var v = verts[i];
        
//         // get the data associated to it
//         var vprops = this.waves[i];
        
//         // update the position of the vertex
//         // v.x = vprops.x + Math.cos(vprops.ang)*vprops.amp;
//         // v.y = vprops.y + Math.sin(vprops.ang)*vprops.amp;

//         // increment the angle for the next frame
//         vprops.ang += vprops.speed;

//     }

//     // Tell the renderer that the geometry of the sea has changed.
//     // In fact, in order to maintain the best level of performance, 
//     // three.js caches the geometries and ignores any changes
//     // unless we add this line
//     this.mesh.geometry.verticesNeedUpdate=true;

//     this.mesh.rotation.x += .005;
//     this.mesh.rotation.y += .005;
//     this.mesh.rotation.z += .005;
// }


// --- //


    // var scene = new THREE.Scene();
    // var camera = new THREE.PerspectiveCamera( 75, three_container.offsetWidth/three_container.offsetHeight, 0.1, 1000 );

    // var renderer = new THREE.WebGLRenderer({ alpha:true, antialias: true });
    // renderer.setSize( three_container.offsetWidth, three_container.offsetHeight );
    // renderer.setClearColor(0xffffff);
    // three_container.appendChild( renderer.domElement );

    // // var light = new THREE.AmbientLight(0xffffff,0.3);
    // // light.position.y = -1000;
    // // scene.add(light);

    // // var light2 = new THREE.PointLight(0xffffff,1);
    // // light2.position.y = 100;
    // // light2.position.x = 100;
    // // light2.position.z = 100;
    // // scene.add(light2);
    
    // // Add an ambient lights
    // var ambientLight = new THREE.AmbientLight( 0xffffff, 0.2 );
    // scene.add( ambientLight );

    // // Add a point light that will cast shadows
    // var pointLight = new THREE.PointLight( 0xffffff, 1 );
    // pointLight.position.set( 100, 250, 250 );
    // pointLight.castShadow = true;
    // pointLight.shadow.mapSize.width = 1024;
    // pointLight.shadow.mapSize.height = 1024;
    // scene.add( pointLight );

    // // Add a second point light that will cast shadows
    // var pointLight_2 = new THREE.PointLight( 0xffffff, 1 );
    // pointLight_2.position.set( -100, 200, 100 );
    // pointLight_2.castShadow = true;
    // pointLight_2.shadow.mapSize.width = 1024;
    // pointLight_2.shadow.mapSize.height = 1024;
    // scene.add( pointLight_2 );

    // // A simple geometric shape with a flat material
    // var shapeOne = new THREE.Mesh(
    //     new THREE.BoxGeometry(10,10,10),
    //     new THREE.MeshStandardMaterial( {
    //         color: 0xff0051,
    //         shading: THREE.FlatShading ,
    //         metalness: 0,
    //         roughness: 0.8
    //     } )
    // );
    // shapeOne.position.set( -100, 200, 100 );
    // // shapeOne.castShadow = true;
    // scene.add(shapeOne);

    // // Add a second shape
    // var shapeTwo = new THREE.Mesh(
    //     new THREE.BoxGeometry(10,10,10),
    //     new THREE.MeshStandardMaterial({
    //         color: 0x47689b,
    //         shading: THREE.FlatShading ,
    //         metalness: 0,
    //         roughness: 0.8
    //     })
    // );
    // shapeTwo.position.set( 100, 250, 250 );
    // // shapeTwo.castShadow = true;
    // scene.add(shapeTwo);

    // var geometry = new THREE.IcosahedronGeometry(20, 1);
    // // var material = new THREE.MeshLambertMaterial( {color: 0x00b7c6, wireframe: false} );
    // var material = new THREE.MeshPhongMaterial({
    //         color: 0x47689b,
    //         shading: THREE.FlatShading
    //         // wireframe: true
    //     });
    // var cube = new THREE.Mesh( geometry, material );
    // // cube.position.y += 50;
    // cube.position.set( 0, 25, 0 );
    // // cube.position.x += 15;
    // cube.rotateZ(Math.PI/50);
    // cube.castShadow = true;
    // cube.receiveShadow = true;
    // scene.add( cube );

    // // A basic material that shows the geometry wireframe.
    // var test_material = new THREE.MeshStandardMaterial({
    //         color: 0x47689b,
    //         shading: THREE.FlatShading ,
    //         metalness: 0,
    //         roughness: 0.8
    //     });
    // var shadowMaterial = new THREE.ShadowMaterial();
    // shadowMaterial.opacity = 0.5;
    // var groundMesh = new THREE.Mesh(
    //     new THREE.BoxGeometry( 500, .1, 500 ),
    //     test_material
    // );
    // groundMesh.receiveShadow = true;
    // scene.add( groundMesh );

    // camera.position.set(0, 30, 80);
    // camera.lookAt(new THREE.Vector3(0, 45, 0));

    // // Enable shadow mapping
    // renderer.shadowMap.enabled = true;
    // renderer.shadowMap.type = THREE.PCFShadowMap;

    // // //create a blue LineBasicMaterial
    // // var line_material = new THREE.LineBasicMaterial({ color: 0x0000ff });

    // // var line_geometry = new THREE.Geometry();
    // // line_geometry.vertices.push(new THREE.Vector3(-10, 0, 0));
    // // line_geometry.vertices.push(new THREE.Vector3(0, 10, 0));
    // // line_geometry.vertices.push(new THREE.Vector3(10, 0, 0));

    // // var line = new THREE.Line(line_geometry, line_material);

    // // scene.add(line);
    // //
    
    // var cylinder_geometry = new THREE.CylinderGeometry( 24, 24, 6, 20, 10 );
    // console.log(cylinder_geometry);
    // cylinder_geometry.openEnded = true;
    // console.log(cylinder_geometry);
    // // cylinder_geometry.thetaLength = 3;
    // var cylinder_material = new THREE.MeshPhongMaterial( {
    //     color: 0x156289,
    //     // emissive: 0x072534,
    //     // side: THREE.DoubleSide,
    //     shading: THREE.FlatShading
    // } );
    // var cylinder = new THREE.Mesh( cylinder_geometry, cylinder_material );
    // cylinder.position.set(0, 25, 0);
    // cylinder.receiveShadow = true;
    // cylinder.castShadow = true;
    // console.log(cylinder);
    // scene.add( cylinder );
    
    // // Add an orbit control which allows us to move around the scene. See the three.js example for more details
    // // https://github.com/mrdoob/three.js/blob/dev/examples/js/controls/OrbitControls.
    // // var controls = new THREE.OrbitControls( camera, renderer.domElement );
    // // controls.addEventListener( 'change', function() { renderer.render(scene, camera); } ); // add this only if there is no animation loop (requestAnimationFrame)

    // var render = function () {
    //     requestAnimationFrame( render );

    //     cube.rotation.x += 0.01;
    //     cube.rotation.y += 0.01;

    //     cylinder.rotation.x -= 0.01;
    //     cylinder.rotation.z -= 0.01;
    //     // cylinder.rotation.y += 0.01;

    //     renderer.render(scene, camera);
    // };

    // render();