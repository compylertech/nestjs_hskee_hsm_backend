This is the table relationship:

// address
address_id	address_type	primary	address_1	city	region	country	address_postalcode
1a252ec5-27c5-4956-a83b-80534241984e	billing	TRUE	updated7 No. 3 Gem Street	Adjiringanor	Greater Accra	Ghana	00233
f35e93ac-45a6-44ce-808c-4dc62c5ea217	billing	TRUE	updated6 account No. 3 Gem Street	Adjiringanor	Greater Accra	Ghana	00233

// entity_address
entity_address_id	entity_id	entity_type	address_id	emergency_address
445e5349-8da1-40bc-80a0-997a4cbee470	a8457e1a-c65d-4e82-af65-842ba32e6d3f	property	1a252ec5-27c5-4956-a83b-80534241984e	FALSE
1c8d99a6-2861-425f-9ecf-bb45fd87e947	40789193-d9f2-442f-9636-6e3fcb1ec62b	entity_account	f35e93ac-45a6-44ce-808c-4dc62c5ea217	FALSE
34e2b0bf-2d60-4514-af27-890ef5e2d358	40789193-d9f2-442f-9636-6e3fcb1ec62b	entity_account	f35e93ac-45a6-44ce-808c-4dc62c5ea217	FALSE
14c7353b-69e8-4a25-83d3-92f98467e09d	a8457e1a-c65d-4e82-af65-842ba32e6d3f	property	1a252ec5-27c5-4956-a83b-80534241984e	FALSE

// account
account_id	bank_account_name	bank_account_number	account_type	account_branch_name
84fe9e8d-4b37-4321-9604-6e024de2d556	updated5 John Doe	123456789	savings	Downtown Branch

// entity_account
entity_account_id	account_id	account_type	entity_id	entity_type	created_at
40789193-d9f2-442f-9636-6e3fcb1ec62b	84fe9e8d-4b37-4321-9604-6e024de2d556	savings	a8457e1a-c65d-4e82-af65-842ba32e6d3f	property	2025-01-04 16:47:25.180

// amenities
amenity_id	amenity_name	amenity_short_name	description	created_at	updated_at
833a69ce-5576-4ba1-a24a-04f80f0628af	updated2 Swimming Pool	Pool	A luxurious swimming pool	2025-01-04 16:47:25.123	2025-01-04 16:47:25.123

// entity_amenities
entity_amenity_id	amenity_id	entity_id	entity_type	apply_to_units
14c7353b-69e8-4a25-83d3-92f98467ee08	833a69ce-5576-4ba1-a24a-04f80f0628af	a8457e1a-c65d-4e82-af65-842ba32e6d3f	property

// media
media_id	media_name	media_type	content_url	is_thumbnail	caption	description
205a673a-3319-48bb-afb0-39d5ec84f4d9	updated4 example2	image	https://res.cloudinary.com/example	FALSE	An example media caption	This is an example media description
0acffbd4-3202-4eeb-b6b7-4d16c6b02f23	updated3 example1	image	https://res.cloudinary.com/example	FALSE	An example media caption	This is an example media description
4de6fdf3-7fab-4d5b-bf79-93ea7613d783	updated1 example1	image	https://res.cloudinary.com/example	FALSE	An example media caption	This is an example media description

// entity_media
entity_media_id	media_id	entity_id	entity_type
be4cd25a-2de4-4815-abd9-2699f3d3add0	205a673a-3319-48bb-afb0-39d5ec84f4d9	14c7353b-69e8-4a25-83d3-92f98467ee08	entity_amenities
473f88f5-cbe4-4460-81b0-d831ea9d62d14	4de6fdf3-7fab-4d5b-bf79-93ea7613d783	a8457e1a-c65d-4e82-af65-842ba32e6d3f	property
09fcd542-4661-44da-b66d-7e23cfeedfb8	0acffbd4-3202-4eeb-b6b7-4d16c6b02f23	14c7353b-69e8-4a25-83d3-92f98467ee08	entity_amenities


These are the tables with the relationsips. You are given an initial info
1:
// global mapping passed
mapping = [
    {
        service: mediaService,
        entityType: EntityMediaTypeEnum.PROPERTY,
        mapKey: 'media',
    },
    {
        service: amenityService,
        entityType: EntityAmenityTypeEnum.PROPERTY,
        mapKey: 'amenities',
    },
    {
        service: accountService,
        entityType: EntityAmenityTypeEnum.PROPERTY,
        mapKey: 'account',
    },
    {
        service: addressService,
        entityType: EntityAmenityTypeEnum.PROPERTY,
        mapKey: 'address',
    }
]


2:
There is a helper function `fetchByEntityIDs` with the method signature:

```
async fetchByEntityIDs(entityIDs: string[], entityType: TDtoTypeEnum | undefined = null)
```

You are to loop through the `mapping` array and for each object in `mapping` make a call to the respective `fetchByEntityIDs` to find the respective related data for a given array of `entityIDs` and of type `entityType`. You have to do this recursively to find the child elements as well.

Consider this dry run
---------------------
We want to create a method `fetchAndMap(entities: string [], identifierKey: string, entityChildAuxKey: string)`.

- There is a class variable `mapping` defined below:
    mapping = [
        {
            service: mediaService,
            entityType: EntityMediaTypeEnum.PROPERTY,
            mapKey: 'media',
        },
        {
            service: amenityService,
            entityType: EntityAmenityTypeEnum.PROPERTY,
            mapKey: 'amenities',
        },
        {
            service: accountService,
            entityType: EntityAmenityTypeEnum.PROPERTY,
            mapKey: 'account',
        },
        {
            service: addressService,
            entityType: EntityAmenityTypeEnum.PROPERTY,
            mapKey: 'address',
        }
    ]
- There is an initial defined array `entities` for the method argument as shown below:
    // entities
    entities = 
    [{"property_unit_assoc_id":"a8457e1a-c65d-4e82-af65-842ba32e6d3f","name":"updated0 property","amount":"0.00","security_deposit":"0.00","commission":"0.00","floor_space":"0.00","num_units":0,"num_bathrooms":0,"num_garages":0,"has_balconies":true,"has_parking_space":true,"pets_allowed":true,"description":"string","property_status":"occupied","created_at":"2025-01-04T16:47:25.068Z","updated_at":"2025-01-04T16:47:25.068Z","property_type":{"property_type_id":2,"name":"hotel","description":"test","created_at":"2024-12-31T05:27:17.144Z","updated_at":"2024-12-31T05:27:17.144Z"},"units":[]}]
- The method argument `identifierKey` is defined below:
    // identifierKey
    identifierKey = "property_unit_assoc_id"
- entityChildAuxKey = `null`.
- Loop through `mapping` and for each item reference the respective service, entityType and mapKey. Suppose we are on the iteration for the given `mapping` item  `service = amenityService`, `entityType = EntityAmenityTypeEnum.PROPERTY`(which translates to "property") and `mapKey = 'amenities'` as shown below:
    ```
    {
        service: amenityService,
        entityType: EntityAmenityTypeEnum.PROPERTY,
        mapKey: 'amenities',
    }
    ```
    We then call the helper method `fetchByEntityIDs(["a8457e1a-c65d-4e82-af65-842ba32e6d3f"], entityChildAuxKey || entityType)`
   
    The sample response from `fetchByEntityIDs`. Notice that we passed ["a8457e1a-c65d-4e82-af65-842ba32e6d3f"] as the `entityIDs` method argument. This was a mapping of the `identifierKey` to the initial `entities` array. The method argument `entityType` = "property" was also passed and since the `entityChildAuxKey` is set to null it would be what would be used in the call to `fetchByEntityIDs`. What it did was search on the `entity_amenities` table for the result (This is because the mapping.service = 'amenityService' and this determines which table to search on). The result is below:

    fetchByEntityIDsResult = {
    "a8457e1a-c65d-4e82-af65-842ba32e6d3f": [
        {
        "entity_amenities_id": "14c7353b-69e8-4a25-83d3-92f98467ee08",
        "amenity_id": "833a69ce-5576-4ba1-a24a-04f80f0628af",
        "entity_id": "a8457e1a-c65d-4e82-af65-842ba32e6d3f",
        "entity_type": "property",
        "apply_to_units": false,
        "created_at": "2025-01-04T16:47:25.129Z",
        "updated_at": "2025-01-04T16:47:25.129Z",
        "amenities": {
            "amenity_id": "833a69ce-5576-4ba1-a24a-04f80f0628af",
            "amenity_name": "updated2 Swimming Pool",
            "amenity_short_name": "Pool",
            "description": "A luxurious swimming pool",
            "created_at": "2025-01-04T16:47:25.123Z",
            "updated_at": "2025-01-04T16:47:25.123Z"
        }
        }
    ]
    }

To find nested child relationships:
    - We want to recursively call our `fetchAndMap(entities: string [], identifierKey: string, entityChildAuxKey: string)` method.
    - The mapped result of the respective entityID would be passed on as the new value for `entities`.
        // entities would now be
        entities = [
            {
                "entity_amenities_id": "14c7353b-69e8-4a25-83d3-92f98467ee08",
                "amenity_id": "833a69ce-5576-4ba1-a24a-04f80f0628af",
                "entity_id": "a8457e1a-c65d-4e82-af65-842ba32e6d3f",
                "entity_type": "property",
                "apply_to_units": false,
                "created_at": "2025-01-04T16:47:25.129Z",
                "updated_at": "2025-01-04T16:47:25.129Z",
                "amenities": {
                "amenity_id": "833a69ce-5576-4ba1-a24a-04f80f0628af",
                "amenity_name": "updated2 Swimming Pool",
                "amenity_short_name": "Pool",
                "description": "A luxurious swimming pool",
                "created_at": "2025-01-04T16:47:25.123Z",
                "updated_at": "2025-01-04T16:47:25.123Z"
                }
            }
        ]
     identifierKey = `entity_amenities_id`
     entityChildAuxKey = `entity_amenities`

    - The `identifierKey` would be `entity_*_id` key from the `fetchByEntityIDsResult`. Since the parent mapKey was "amenities". The `identifierKey` would be `entity_amenities_id`.
    - Prefix the mapping.mapKey = 'amenities' with `entity_` and this would be the `entityChildAuxKey` passed as an argument to `fetchAndMap` method. 
    - Iterate through the mapping and for each service and find related data. For instance if on the iteration we are on the service `mediaService`.  
    
    The helper method would look like this `fetchByEntityIDs(["14c7353b-69e8-4a25-83d3-92f98467ee08"], "entity_amenities_id", entityChildAuxKey || entityType)`. Because we are on the loop which corresponds to the service = `mediaService`, it would now search on the entity_media table. This would result in the following:

    // child result from fetchByEntityID call
    fetchByEntityIDsResult = { 
        "14c7353b-69e8-4a25-83d3-92f98467ee08": [
            {
            "entity_media_id": "be4cd25a-2de4-4815-abd9-2699f3d3add0",
            "media_id": "205a673a-3319-48bb-afb0-39d5ec84f4d9",
            "entity_id": "14c7353b-69e8-4a25-83d3-92f98467ee08",
            "entity_type": "entity_amenities",
            "media_type": "image",
            "created_at": "2025-01-04T16:47:27.853Z",
            "updated_at": "2025-01-04T16:47:27.853Z",
            "media": {
                "media_id": "205a673a-3319-48bb-afb0-39d5ec84f4d9",
                "media_name": "updated4 example2",
                "media_type": "image",
                "content_url": "https://res.cloudinary.com/dm42zhzrf/image/upload/v1735935613/undefined/media/updated4_example2.png",
                "is_thumbnail": false,
                "caption": "An example media caption",
                "description": "This is an example media description.",
                "created_at": "2025-01-04T16:47:27.807Z",
                "updated_at": "2025-01-04T16:47:27.807Z"
            }
            },
            {
            "entity_media_id": "09fcd542-4661-44da-b66d-7e2c3feedfb8",
            "media_id": "0acffbd4-3202-4eeb-b6b7-4d16c6b02f23",
            "entity_id": "14c7353b-69e8-4a25-83d3-92f98467ee08",
            "entity_type": "entity_amenities",
            "media_type": "image",
            "created_at": "2025-01-04T16:47:27.817Z",
            "updated_at": "2025-01-04T16:47:27.817Z",
            "media": {
                "media_id": "0acffbd4-3202-4eeb-b6b7-4d16c6b02f23",
                "media_name": "updated3 example1",
                "media_type": "image",
                "content_url": "https://res.cloudinary.com/dm42zhzrf/image/upload/v1735935613/undefined/media/updated3_example1.png",
                "is_thumbnail": false,
                "caption": "An example media caption",
                "description": "This is an example media description.",
                "created_at": "2025-01-04T16:47:26.496Z",
                "updated_at": "2025-01-04T16:47:26.496Z"
            }
            }
        ]
        }
