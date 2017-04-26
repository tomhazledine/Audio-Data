var three_container = document.getElementById('three-test');

if ( typeof three_container != 'undefined' ) {

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, three_container.offsetWidth/three_container.offsetHeight, 0.1, 1000 );

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( three_container.offsetWidth, three_container.offsetHeight );
    renderer.setClearColor(0x000000);
    three_container.appendChild( renderer.domElement );

    var light = new THREE.AmbientLight(0xffffff,0.5);
    scene.add(light);

    var light2 = new THREE.PointLight(0xffffff,0.5);
    light2.position.y = 100;
    light2.position.z = 100;
    scene.add(light2);

    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshLambertMaterial( { color: 0xd03ff0 } );
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    camera.position.z = 5;

    var render = function () {
        requestAnimationFrame( render );

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        renderer.render(scene, camera);
    };

    render();
}