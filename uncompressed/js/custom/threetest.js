var three_container = document.getElementById('three-test');

if ( typeof three_container != 'undefined' ) {

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, three_container.offsetWidth/three_container.offsetHeight, 0.1, 1000 );

    var renderer = new THREE.WebGLRenderer({ alpha:true, antialias: true });
    renderer.setSize( three_container.offsetWidth, three_container.offsetHeight );
    renderer.setClearColor(0xffffff);
    three_container.appendChild( renderer.domElement );

    // var light = new THREE.AmbientLight(0xffffff,0.3);
    // light.position.y = -1000;
    // scene.add(light);

    // var light2 = new THREE.PointLight(0xffffff,1);
    // light2.position.y = 100;
    // light2.position.x = 100;
    // light2.position.z = 100;
    // scene.add(light2);
    
    // Add an ambient lights
    var ambientLight = new THREE.AmbientLight( 0xffffff, 0.2 );
    scene.add( ambientLight );

    // Add a point light that will cast shadows
    var pointLight = new THREE.PointLight( 0xffffff, 1 );
    pointLight.position.set( 100, 250, 250 );
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 1024;
    pointLight.shadow.mapSize.height = 1024;
    scene.add( pointLight );

    // Add a second point light that will cast shadows
    var pointLight_2 = new THREE.PointLight( 0xffffff, 1 );
    pointLight_2.position.set( -100, 200, 100 );
    pointLight_2.castShadow = true;
    pointLight_2.shadow.mapSize.width = 1024;
    pointLight_2.shadow.mapSize.height = 1024;
    scene.add( pointLight_2 );

    // A simple geometric shape with a flat material
    var shapeOne = new THREE.Mesh(
        new THREE.BoxGeometry(10,10,10),
        new THREE.MeshStandardMaterial( {
            color: 0xff0051,
            shading: THREE.FlatShading ,
            metalness: 0,
            roughness: 0.8
        } )
    );
    shapeOne.position.set( -100, 200, 100 );
    // shapeOne.castShadow = true;
    scene.add(shapeOne);

    // Add a second shape
    var shapeTwo = new THREE.Mesh(
        new THREE.BoxGeometry(10,10,10),
        new THREE.MeshStandardMaterial({
            color: 0x47689b,
            shading: THREE.FlatShading ,
            metalness: 0,
            roughness: 0.8
        })
    );
    shapeTwo.position.set( 100, 250, 250 );
    // shapeTwo.castShadow = true;
    scene.add(shapeTwo);

    var geometry = new THREE.IcosahedronGeometry(20, 1);
    // var material = new THREE.MeshLambertMaterial( {color: 0x00b7c6, wireframe: false} );
    var material = new THREE.MeshStandardMaterial({
            color: 0x47689b,
            shading: THREE.FlatShading ,
            metalness: 0,
            roughness: 0.8,
            // wireframe: true
        });
    var cube = new THREE.Mesh( geometry, material );
    // cube.position.y += 50;
    cube.position.set( 0, 25, 0 );
    // cube.position.x += 15;
    cube.rotateZ(Math.PI/50);
    cube.castShadow = true;
    scene.add( cube );

    // A basic material that shows the geometry wireframe.
    var test_material = new THREE.MeshStandardMaterial({
            color: 0x47689b,
            shading: THREE.FlatShading ,
            metalness: 0,
            roughness: 0.8
        });
    var shadowMaterial = new THREE.ShadowMaterial();
    shadowMaterial.opacity = 0.5;
    var groundMesh = new THREE.Mesh(
        new THREE.BoxGeometry( 500, .1, 500 ),
        test_material
    );
    groundMesh.receiveShadow = true;
    scene.add( groundMesh );

    camera.position.set(0, 30, 80);
    camera.lookAt(new THREE.Vector3(0, 45, 0));

    // Enable shadow mapping
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    // //create a blue LineBasicMaterial
    // var line_material = new THREE.LineBasicMaterial({ color: 0x0000ff });

    // var line_geometry = new THREE.Geometry();
    // line_geometry.vertices.push(new THREE.Vector3(-10, 0, 0));
    // line_geometry.vertices.push(new THREE.Vector3(0, 10, 0));
    // line_geometry.vertices.push(new THREE.Vector3(10, 0, 0));

    // var line = new THREE.Line(line_geometry, line_material);

    // scene.add(line);
    //
    
    var cylinder_geometry = new THREE.CylinderGeometry( 24, 24, 6, 20, 10, true );
    cylinder_geometry.openEnded = true;
    // cylinder_geometry.thetaLength = 3;
    var cylinder_material = new THREE.MeshPhongMaterial( {
        color: 0x156289,
        // emissive: 0x072534,
        side: THREE.DoubleSide,
        shading: THREE.FlatShading
    } );
    var cylinder = new THREE.Mesh( cylinder_geometry, cylinder_material );
    cylinder.position.set(0, 25, 0);
    cylinder.receiveShadow = true;
    cylinder.castShadow = true;
    console.log(cylinder);
    scene.add( cylinder );
    
    // Add an orbit control which allows us to move around the scene. See the three.js example for more details
    // https://github.com/mrdoob/three.js/blob/dev/examples/js/controls/OrbitControls.
    var controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.addEventListener( 'change', function() { renderer.render(scene, camera); } ); // add this only if there is no animation loop (requestAnimationFrame)

    var render = function () {
        requestAnimationFrame( render );

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        cylinder.rotation.x -= 0.01;
        cylinder.rotation.z -= 0.01;
        // cylinder.rotation.y += 0.01;

        renderer.render(scene, camera);
    };

    render();
}