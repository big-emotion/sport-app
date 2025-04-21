<?php

namespace App\Exception;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ResourceNotFoundException extends NotFoundHttpException
{
    public function __construct(string $message = 'Resource not found', \Throwable $previous = null, int $code = 0, array $headers = [])
    {
        parent::__construct($message, $previous, $code, $headers);
    }
    
    public static function forResource(string $resourceName, string $fieldName, $fieldValue): self
    {
        return new self(sprintf('%s not found with %s: \'%s\'', $resourceName, $fieldName, $fieldValue));
    }
} 