<?php

namespace App\Services;
use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Exception;
use Psr\Log\LoggerInterface;

class UserService
{
    private Connection $connection;
    private LoggerInterface $logger;

    public function __construct(Connection $connection, LoggerInterface $logger)
    {
        $this->connection = $connection;
        $this->logger = $logger;
    }

    public function getAll(): array
    {
        try {
            $query = $this->connection->createQueryBuilder();
            $query
                ->select('*')
                ->from('users');

            return $query->executeQuery()->fetchAllAssociative();
        } catch (Exception $e) {
            $this->logger->error($e->getMessage());
            return [];
        }
    }
}