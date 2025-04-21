<?php

namespace App\Service;

use Psr\Cache\CacheItemPoolInterface;
use Symfony\Component\Cache\Adapter\TagAwareAdapterInterface;
use Symfony\Contracts\Cache\ItemInterface;

class CacheService
{
    private CacheItemPoolInterface $venueCache;
    private CacheItemPoolInterface $userCache;
    private CacheItemPoolInterface $sportCache;
    private CacheItemPoolInterface $reviewCache;
    private CacheItemPoolInterface $bookingCache;

    public function __construct(
        CacheItemPoolInterface $venueCache,
        CacheItemPoolInterface $userCache,
        CacheItemPoolInterface $sportCache,
        CacheItemPoolInterface $reviewCache,
        CacheItemPoolInterface $bookingCache
    ) {
        $this->venueCache = $venueCache;
        $this->userCache = $userCache;
        $this->sportCache = $sportCache;
        $this->reviewCache = $reviewCache;
        $this->bookingCache = $bookingCache;
    }

    public function getVenueCache(): CacheItemPoolInterface
    {
        return $this->venueCache;
    }

    public function getUserCache(): CacheItemPoolInterface
    {
        return $this->userCache;
    }

    public function getSportCache(): CacheItemPoolInterface
    {
        return $this->sportCache;
    }

    public function getReviewCache(): CacheItemPoolInterface
    {
        return $this->reviewCache;
    }

    public function getBookingCache(): CacheItemPoolInterface
    {
        return $this->bookingCache;
    }

    public function get(string $type, string $key, callable $callback, array $tags = []): mixed
    {
        if (!isset($this->pools[$type])) {
            throw new \InvalidArgumentException(sprintf('Unknown cache type: %s', $type));
        }

        $pool = $this->pools[$type];
        
        if ($pool instanceof TagAwareAdapterInterface) {
            return $pool->get($key, function (ItemInterface $item) use ($callback, $tags) {
                $item->tag($tags);
                return $callback();
            });
        }

        return $pool->get($key, $callback);
    }

    public function delete(string $type, string $key): bool
    {
        if (!isset($this->pools[$type])) {
            throw new \InvalidArgumentException(sprintf('Unknown cache type: %s', $type));
        }

        return $this->pools[$type]->deleteItem($key);
    }

    public function clear(string $type): bool
    {
        if (!isset($this->pools[$type])) {
            throw new \InvalidArgumentException(sprintf('Unknown cache type: %s', $type));
        }

        return $this->pools[$type]->clear();
    }

    public function invalidateCache(string $cacheName, array $tags = []): void
    {
        $cache = match ($cacheName) {
            'venue' => $this->venueCache,
            'user' => $this->userCache,
            'sport' => $this->sportCache,
            'review' => $this->reviewCache,
            'booking' => $this->bookingCache,
            default => throw new \InvalidArgumentException(sprintf('Unknown cache: %s', $cacheName)),
        };

        if ($cache instanceof TagAwareAdapterInterface && !empty($tags)) {
            $cache->invalidateTags($tags);
        }
    }

    public function clearCache(string $cacheName): void
    {
        $cache = match ($cacheName) {
            'venue' => $this->venueCache,
            'user' => $this->userCache,
            'sport' => $this->sportCache,
            'review' => $this->reviewCache,
            'booking' => $this->bookingCache,
            default => throw new \InvalidArgumentException(sprintf('Unknown cache: %s', $cacheName)),
        };

        $cache->clear();
    }
} 