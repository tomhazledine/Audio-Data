var three_container = document.getElementById('three-test');

if ( typeof three_container != 'undefined' ) {
    console.log('three container found!');

    var scene = new THREE.Scene();
    console.log(three_container.offsetHeight);
    var camera = new THREE.PerspectiveCamera( 75, three_container.offsetWidth/three_container.offsetHeight, 0.1, 1000 );

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( three_container.offsetWidth, three_container.offsetHeight );
    three_container.appendChild( renderer.domElement );

    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    camera.position.z = 5;

    var render = function () {
        requestAnimationFrame( render );

        cube.rotation.x += 0.1;
        cube.rotation.y += 0.1;

        renderer.render(scene, camera);
    };

    render();
}