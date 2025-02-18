<?php

namespace App\Controller;

use App\Services\UserService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class UserController extends AbstractController
{
    private UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    #[Route('/user/add', name: 'addUser')]
    public function addUser(Request $request): JsonResponse
    {
        $error = '';
        $data = [
            'name' => $request->get('name'),
            'surname' => $request->get('surname'),
            'email' => $request->get('email'),
            'age' => $request->get('age'),
            'login' => $request->get('login')
        ];

        $success = $this->userService->add($data);
        if ($success) {
            return new JsonResponse(['user' => $data]);
        }
        else{
            return new JsonResponse(['user' => null, 'error' => $error]);
        }
    }
}