<?php
/**
 * Create your routes in here. The name is the lowercase name of the controller
 * without the controller part, the stuff after the hash is the method.
 * e.g. page#index -> OCA\PDSInterop\Controller\PageController->index()
 *
 * The controller class has to be registered in the application.php file since
 * it's instantiated in there
 */
return [
    'routes' => [
        ['name' => 'openid#index', 'url' => '/openid', 'verb' => 'GET'],
        ['name' => 'page#index', 'url' => '/', 'verb' => 'GET'],
        ['name' => 'page#do_echo', 'url' => '/echo', 'verb' => 'POST'],
        ['name' => 'page#profile', 'url' => '/@{username}/', 'verb' => 'GET'],
        ['name' => 'page#turtleProfile', 'url' => '/@{username}/turtle', 'verb' => 'GET' ]
    ]
];
