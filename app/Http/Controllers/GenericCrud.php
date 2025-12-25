<?php

declare(strict_types=1);

namespace App\Http\Controllers;
use Illuminate\Http\Request;

class GenericCrud
{
    /**
     * Affichage d'une ressource
     *
     * @param  string  $modelClass  - Classe du modèle
     * @param  int|string  $id  - Identifiant de la ressource
     * @param  array<int, string>  $with  - Relations à charger (eager loading)
     * @param  callable|null  $extraQuery  - Callback pour personnaliser la requête
     * @return mixed - La ressource trouvée
     */
    public static function show(
        string $modelClass,
        int|string $id,
        array $with = [],
        ?callable $extraQuery = null
    ): mixed {
        $query = $modelClass::query();

        if ($with !== []) {
            $query->with($with);
        }

        if ($extraQuery) {
            $extraQuery($query);
        }

        return $query->findOrFail($id);
    }

    /**
     * Fonction générique pour le store d'une ressource API
     *
     * @param  Request  $request
     * @param  string  $modelClass  - La classe du modèle (ex: User::class)
     * @return mixed - La ressource créée
     */
    public static function store(Request $request, string $modelClass): mixed
    {
        return transaction(function () use ($request, $modelClass) {
            $data = $request->validated();

            return $modelClass::create($data);
        });
    }

    /**
     * Fonction générique pour l'update d'une ressource API
     *
     * @param  Request  $request
     * @param  string  $modelClass  - La classe du modèle (ex: User::class)
     * @param  int|string  $id  - L'identifiant de la ressource
     * @return mixed - La ressource mise à jour
     */
    public static function update(Request $request, string $modelClass, int|string $id): mixed
    {
        return transaction(function () use ($request, $modelClass, $id) {
            $resource = $modelClass::findOrFail($id);

            $data = $request->validated();

            $resource->update($data);

            return $resource;
        });
    }

    /**
     * Suppression d'une ressource
     */
    public static function destroy(string $modelClass, int|string $id): mixed
    {
        return transaction(function () use ($modelClass, $id) {
            $resource = $modelClass::findOrFail($id);

            $resource->delete();

            return $resource;
        });
    }
}