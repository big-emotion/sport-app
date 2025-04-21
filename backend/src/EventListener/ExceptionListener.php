<?php

namespace App\EventListener;

use App\Exception\ResourceNotFoundException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\Validator\Exception\ValidationFailedException;

class ExceptionListener
{
    public function onKernelException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();
        $request = $event->getRequest();
        
        // Only handle JSON API requests
        if ('json' !== $request->getContentType() && !str_contains($request->getPathInfo(), '/api/')) {
            return;
        }
        
        $response = new JsonResponse();
        
        // HttpExceptionInterface is a special type of exception with status code
        if ($exception instanceof HttpExceptionInterface) {
            $response->setStatusCode($exception->getStatusCode());
            $response->headers->replace($exception->getHeaders());
        } else {
            $response->setStatusCode(JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
        
        // Prepare response data based on exception type
        $responseData = [
            'timestamp' => (new \DateTime())->format('c'),
            'status' => $response->getStatusCode(),
        ];
        
        // Handle validation exceptions
        if ($exception instanceof ValidationFailedException) {
            $errors = [];
            $violations = $exception->getViolations();
            
            foreach ($violations as $violation) {
                $errors[] = sprintf(
                    '%s: %s',
                    $violation->getPropertyPath(),
                    $violation->getMessage()
                );
            }
            
            $responseData['message'] = 'Validation failed';
            $responseData['errors'] = $errors;
            $response->setStatusCode(JsonResponse::HTTP_BAD_REQUEST);
        } else {
            // For all other exceptions
            $responseData['message'] = $exception->getMessage();
            
            // In dev environment, you might want to include more details
            if ($_ENV['APP_ENV'] === 'dev') {
                $responseData['trace'] = $exception->getTraceAsString();
            }
        }
        
        $response->setData($responseData);
        $event->setResponse($response);
    }
} 