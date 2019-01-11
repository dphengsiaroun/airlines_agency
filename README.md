# SPLUNK Query example with KV Store

- Lister les éléments d'un fichier CSV
```
| inputlookup TravelersCSV
```

- Lister les éléments d'un fichier CSV et y ajouter un champ 'transit_status' pour ajouter le suivi des éléments traités au tableau.
````
| inputlookup TravelersCSV | lookup transit_kv_lookup id as num OUTPUT status as transit_status
````

- Lister tous les éléments ayant pour codeAir "AS"
````
| inputlookup TravelersCSV | lookup transit_kv_lookup id as num OUTPUT status as transit_status | where codeAir="AS"
````

- Mettre tous les éléments au statut 1 sur la colonne transit_status
````
| inputlookup TravelersCSV | lookup transit_kv_lookup id as num OUTPUT status as transit_status | where codeAir="AS" | eval transit_status = 1 
````

- Retirer tous les éléments ayant déjà le statut 1
````
| inputlookup TravelersCSV | lookup transit_kv_lookup id as num OUTPUT status as transit_status | where codeAir="AS" | eval transit_status = 1 | search NOT [| inputlookup transit_kv_lookup | rename id as num | table num ]
````

- Faire l'association du champ codeAir avec son libellé 
````
| inputlookup TravelersCSV | lookup transit_kv_lookup id as num OUTPUT status as transit_status | where codeAir="AS" | eval transit_status = 1 | search NOT [| inputlookup transit_kv_lookup | rename id as num | table num ] | lookup AirlinesCSV IATA_CODE as codeAir OUTPUT AIRLINE
````

- Renommer les champs sortis afin qu'elles soient en cohérence avec ceux définis dans la transit_kv_lookup
````
| inputlookup TravelersCSV | lookup transit_kv_lookup id as num OUTPUT status as transit_status | where codeAir="AS" | eval transit_status = 1 | search NOT [| inputlookup transit_kv_lookup | rename id as num | table num ] | lookup AirlinesCSV IATA_CODE as codeAir OUTPUT AIRLINE| rename num as id transit_status as status AIRLINE as airlines
````


- Afficher un tableau en fonction des champs définis dans la transit_kv_lookup
````
| inputlookup TravelersCSV | lookup transit_kv_lookup id as num OUTPUT status as transit_status | where codeAir="AS" | eval transit_status = 1 | search NOT [| inputlookup transit_kv_lookup | rename id as num | table num ] | lookup AirlinesCSV IATA_CODE as codeAir OUTPUT AIRLINE| rename num as id transit_status as status AIRLINE as airlines | table id lastname firstname email airlines status
````

- Ajouter les éléments traités dans la transit_kv_lookup
```
| inputlookup TravelersCSV | lookup transit_kv_lookup id as num OUTPUT status as transit_status | where codeAir="AS" | eval transit_status = 1 | search NOT [| inputlookup transit_kv_lookup | rename id as num | table num ] | lookup AirlinesCSV IATA_CODE as codeAir OUTPUT AIRLINE| rename num as id transit_status as status AIRLINE as airlines | table id lastname firstname email airlines status | outputlookup transit_kv_lookup append=true
```

`!ATTENTION!`

`avant de faire un outputlookup s'assurer que l'on est bien ajouter la commande append=true car sans cela toutes les données de la kv concernées seront remplacées par celles que nous souhaitons envoyés`


- Requête avec condition qui permet l'affichage des statuts dynamiquement en fonction des différents éléments dans la transit_kv_lookup et la valid_kv_lookup
````
| inputlookup TravelersCSV | lookup transit_kv_lookup id as num OUTPUT status as transit_status  | lookup valid_kv_lookup id as num OUTPUT status as valid_status | 
eval status = 
if(transit_status == 1,
    if(valid_status == 2, "Valid", 
    if(valid_status == 3, "Cancel", "In progress")), 
"Not yet")
````
