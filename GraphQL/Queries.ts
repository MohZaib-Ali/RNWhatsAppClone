import { gql } from "@apollo/client";

export const GET_CHATS = gql`
    {
        Chats {
            ID
            Group
            Name
            ImageURI
            Participants {
                ID
                Name
                Email
                ImageURI
                Status
            }
            Messages {
                Content
                CreatedBy {
                    ID
                    Name
                    Email
                    ImageURI
                    Status
                }
                CreatedAt
            }
        }
    }
`

export const GET_USERS = gql`
    {
        Users {
            ID
            Name
            Email
            ImageURI
            Status
            Chats {
                ID
                Group
                Name
                ImageURI
                Participants {
                    ID
                    Name
                    Email
                    ImageURI
                    Status
                }
                Messages {
                    Content
                    CreatedBy {
                        ID
                        Name
                        Email
                        ImageURI
                        Status
                    }
                    CreatedAt
                }
            }
            Contacts {
                ID
                Name
                Email
                ImageURI
                Status
            }
        }
    }
`

export const GET_MYUSERS = gql`
    query ($myID: ID!) {
        MyUsers (
            myID: $myID
        ) {
            ID
            Name
            Email
            ImageURI
            Status
            Chats {
                ID
                Group
                Name
                ImageURI
                Participants {
                    ID
                    Name
                    Email
                    ImageURI
                    Status
                }
                Messages {
                    Content
                    CreatedBy {
                        ID
                        Name
                        Email
                        ImageURI
                        Status
                    }
                    CreatedAt
                }
            }
            Contacts {
                ID
                Name
                Email
                ImageURI
                Status
            }
        }
    }
`

export const SIGN_INTO_IT = gql`
    mutation (
        $ID: ID!, 
        $Name: String!,
        $Email: String!,
        $ImageURI: String!, 
        $Status: String!,
        )
        {
            AddUser (
                ID: $ID,
                Name: $Name,
                Email: $Email,
                ImageURI: $ImageURI,
                Status: $Status
                ) {
                ID
                Name
                Email
                ImageURI
                Status
                Contacts {
                    ID
                    Name
                    Email
                    ImageURI
                    Status
                }
                Chats {
                    ID
                    Group
                    Name
                    ImageURI
                    Messages {
                        Content
                        CreatedBy {
                            ID
                            Name
                            Email
                            ImageURI
                            Status
                        }
                        CreatedAt
                    }
                }
            }
        }`

export const ADD_CONTACT = gql`
        mutation (
            $myID: ID!, 
            $ContactID: ID!,
            )
            {
                AddContact (
                    myID: $myID,
                    ContactID: $ContactID,
                    ) {
                    ID
                    Name
                    Email
                    ImageURI
                    Status
                    Contacts {
                        ID
                        Name
                        Email
                        ImageURI
                        Status
                    }
                    Chats {
                        ID
                        Group
                        Name
                        ImageURI
                        Messages {
                            Content
                            CreatedBy {
                                ID
                                Name
                                Email
                                ImageURI
                                Status
                            }
                            CreatedAt
                        }
                    }
                }
            }`

export const ADD_CHAT = gql`
            mutation (
                $ID: ID!,
                $Group: Boolean!,
                $Name: String!,
                $ImageURI: String!,
                $ParticipantIDs: [ID!]!,
                $MessageCreatorID: ID!,
                $MessageContent: String!,
                $MessageCreatedAt: String!,
                )
                {
                    AddChat (
                        ID: $ID,
                        Group: $Group,
                        Name: $Name,
                        ImageURI: $ImageURI,
                        ParticipantIDs: $ParticipantIDs,
                        MessageCreatorID: $MessageCreatorID,
                        MessageContent: $MessageContent,
                        MessageCreatedAt: $MessageCreatedAt,
                        ) {
                        ID
                        Group
                        Name
                        ImageURI
                        Participants {
                            ID
                            Name
                            Email
                            ImageURI
                            Status
                            }
                        Messages {
                            Content
                            CreatedBy {
                                ID
                                Name
                                Email
                                ImageURI
                                Status
                            }
                            CreatedAt
                        }
                    }
                }`

export const ADD_MESSAGE = gql`
                mutation (
                    $ChatID: ID!,
                    $CreatorID: ID!,
                    $Content: String!,
                    $CreatedAt: String!
                    )
                    {
                        AddMessage (
                            ChatID: $ChatID,
                            CreatorID: $CreatorID,
                            Content: $Content,
                            CreatedAt: $CreatedAt
                            ) {
                            ID
                            Group
                            Name
                            ImageURI
                            Participants {
                                ID
                                Name
                                Email
                                ImageURI
                                Status
                                }
                            Messages {
                                Content
                                CreatedBy {
                                    ID
                                    Name
                                    Email
                                    ImageURI
                                    Status
                                }
                                CreatedAt
                            }
                        }
                    }`