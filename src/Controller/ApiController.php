<?php

namespace App\Controller;

use Symfony\Component\DependencyInjection\Container;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerAwareTrait;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Routing\Annotation\Route;

class ApiController implements ContainerAwareInterface
{
    use ContainerAwareTrait;

    public function indexHtml()
    {
        return new Response(
            file_get_contents($this->container->getParameter('kernel.project_dir') . '/public/index.html')
        );
    }

    public function index()
    {
        $data = $this->getData();
        $index = array_values($data);
        return (new JsonResponse())
            ->setEncodingOptions(JSON_UNESCAPED_UNICODE)
            ->setData($index)
        ;
    }

    public function show($id)
    {
        $data = $this->getData();
        $item = $data[$id] ?? null;

        if (!$item) {
            return new JsonResponse(['error' => 'Not found'], 404);
        }

        return (new JsonResponse())
            ->setEncodingOptions(JSON_UNESCAPED_UNICODE)
            ->setData($item)
        ;
    }

    public function create(Request $request)
    {
        $item = json_decode($request->getContent(), JSON_OBJECT_AS_ARRAY);

        if (!is_array($item) ||
            empty($item['name']) ||
            empty($item['width']) ||
            empty($item['height']) ||
            empty($item['data'])
        ) {
            throw new BadRequestHttpException();
        }

        $data = $this->getData();
        $newId = ($this->getMaxId($data) ?? 0) + 1;
        $item['id'] = $newId;
        $data["$newId"] = $item;
        $this->setData($data);

        return (new JsonResponse())
            ->setEncodingOptions(JSON_UNESCAPED_UNICODE)
            ->setData($item)
        ;
    }

    public function destroy($id)
    {
        $data = $this->getData();
        $item = $data[$id] ?? null;

        if (!$item) {
            return new JsonResponse(['error' => 'Not found'], 404);
        }

        unset($data[$id]);
        $this->setData($data);

        return (new JsonResponse())
            ->setEncodingOptions(JSON_UNESCAPED_UNICODE)
            ->setData($item)
        ;
    }

    private function getData()
    {
        $dataFile = $this->container->getParameter('kernel.project_dir') . '/var/data/data.json';
        $data = json_decode(file_get_contents($dataFile), JSON_OBJECT_AS_ARRAY);

        return $data ?? [];
    }

    private function setData($data)
    {
        $dataFile = $this->container->getParameter('kernel.project_dir') . '/var/data/data.json';
        file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

    private function getMaxId($data)
    {
        return max(array_map('intval', array_keys($data)));
    }
}
