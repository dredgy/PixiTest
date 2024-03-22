import {EntityType} from "../Types.ts";

export const getDummyCoordinates = () => {
    const attributeGroups : ProblemMapAttributeGroup[] = [
        {
            id: 1,
            entity_id: 2,
            problem_map_id : 1,
            x: 500,
            y: 500
        },
        {
            id: 2,
            entity_id: 3,
            problem_map_id : 1,
            x: 900,
            y: 320,
        }
    ]

    return attributeGroups
}

export const getDummyRelationships = () => {
    const relationships : Relationship[] = [
        {
            id: 1,
            attribute_1_id:4,
            attribute_2_id: 10
        }
    ]
    return relationships
}

export const getDummyEntities = () => {
    const entities : Entity[] = [
        {
            id : 1,
            title : "Test Company Problem Map",
            content : "",
            parent_entity_id : null,
            type: EntityType.ProblemMap
        },
        {
            id : 2,
            title : "Entity 1",
            content : "Balls",
            parent_entity_id : 1,
            type: EntityType.AttributeGroup
        },
        {
            id : 3,
            title : "Entity 2",
            content : "Penis",
            parent_entity_id : 1,
            type: EntityType.AttributeGroup
        },
        {
            id : 4,
            title : "Attribute 1",
            content : "",
            parent_entity_id : 2,
            type: EntityType.Attribute
        },
        {
            id : 5,
            title : "Attribute 2",
            content : "",
            parent_entity_id : 2,
            type: EntityType.Attribute
        },
        {
            id : 6,
            title : "Attribute 3",
            content : "",
            parent_entity_id : 2,
            type: EntityType.Attribute
        },
        {
            id : 7,
            title : "Attribute 4",
            content : "",
            parent_entity_id : 2,
            type: EntityType.Attribute
        },
        {
            id : 8,
            title : "Attribute 5",
            content : "",
            parent_entity_id : 2,
            type: EntityType.Attribute
        },
        {
            id : 9,
            title : "Attribute 6",
            content : "",
            parent_entity_id : 3,
            type: EntityType.Attribute
        },
        {
            id : 10,
            title : "Attribute 7",
            content : "This one has content",
            parent_entity_id : 3,
            type: EntityType.Attribute
        },
        {
            id : 11,
            title : "Attribute 8",
            content : "",
            parent_entity_id : 3,
            type: EntityType.Attribute
        },
        {
            id : 12,
            title : "Attribute 9",
            content : "",
            parent_entity_id : 3,
            type: EntityType.Attribute
        },
    ]

    return entities
}