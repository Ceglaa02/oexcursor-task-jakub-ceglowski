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

    #[Route('/user/add', name: 'addUser', methods: ['POST'])]
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

        $id = $this->userService->add($data);
        $data['id'] = $id;

        if (!is_null($id)) {
            return new JsonResponse(['user' => $data]);
        }
        else{
            return new JsonResponse(['user' => null, 'error' => $error]);
        }
    }

    #[Route('/user/delete/{id}', name: 'deleteUser', methods: ['GET'])]
    public function deleteUser(Request $request): JsonResponse
    {
        $id = $request->get('id');
        return new JsonResponse(['success' => $this->userService->delete($id)]);
    }

    #[Route('/user/edit/{id}', name: 'editUser', methods: ['POST'])]
    public function editUser(Request $request): JsonResponse
    {
        $error = '';
        $data = [
            'name' => $request->get('name'),
            'surname' => $request->get('surname'),
            'email' => $request->get('email'),
            'age' => $request->get('age'),
            'login' => $request->get('login')
        ];

        $id = $request->get('id');

        if ($this->userService->update($id, $data)) {
            return new JsonResponse(['user' => $data]);
        }
        else{
            return new JsonResponse(['user' => null, 'error' => $error]);
        }
    }
}