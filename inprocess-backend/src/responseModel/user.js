module.exports = {
    FindAllUser: {
        200: [{
                id: {
                    type: 'number',
                    example: 1
                },
                name: {
                    type: 'string',
                    example: 'Ricardo Moya'
                },
                email: {
                    type: 'string',
                    example: 'ricardo.moya@inprocessgroup.com'
                },
                role: {
                    type: 'number',
                    example: 1
                },
                updateAt: {
                    type: 'string',
                    example: '2022-03-17 11:02:29'
                },
                createdAt: {
                    type: 'string',
                    example: '2022-03-17 11:02:29'
                }
            },
            {
                id: {
                    type: 'number',
                    example: 2
                },
                name: {
                    type: 'string',
                    example: 'Silvia Galmes'
                },
                email: {
                    type: 'string',
                    example: 'silvia.galmes@inprocessgroup.com'
                },
                role: {
                    type: 'number',
                    example: 1
                },
                updateAt: {
                    type: 'string',
                    example: '2022-03-17 12:02:29'
                },
                createdAt: {
                    type: 'string',
                    example: '2022-03-17 12:02:29'
                }
        }]        
    },
    CreateUser: {
        200: {
            id: {
                type: 'number',
                example: 1
            },
            name: {
                type: 'string',
                example: 'Ricardo Moya'
            },
            email: {
                type: 'string',
                example: 'ricardo.moya@inprocessgroup.com'
            },
            role: {
                type: 'number',
                example: 1
            },
            updateAt: {
                type: 'string',
                example: '2022-03-17 12:02:29'
            },
            createdAt: {
                type: 'string',
                example: '2022-03-17 12:02:29'
            }
        }
    },
    UpdateUser: {
        200: {
            id: {
                type: 'number',
                example: 1
            },
            name: {
                type: 'string',
                example: 'Ricardo Moya'
            },
            email: {
                type: 'string',
                example: 'ricardo.moya@inprocessgroup.com'
            },
            role: {
                type: 'number',
                example: 1
            },
            updateAt: {
                type: 'string',
                example: '2022-03-17 12:02:29'
            },
            createdAt: {
                type: 'string',
                example: '2022-03-11 11:03:22' 
            }
        }
    },
    DeleteUser: {
        200: {
            id: {
                type: 'number',
                example: 80
            }
        }
    },
    DeleteUsers: {
        200: {
            id: {
                type: 'string',
                example: '80,83,90'
            }
        }
    },
    ResetPassword: {
        200: {
            id: {
                type: 'number',
                example: 1
            },
            name: {
                type: 'string',
                example: 'Ricardo Moya'
            },
            email: {
                type: 'string',
                example: 'ricardo.moya@inprocessgroup.com'
            },
            role: {
                type: 'number',
                example: 1
            },
            updateAt: {
                type: 'string',
                example: '2022-03-17 12:02:29'
            },
            createdAt: {
                type: 'string',
                example: '2022-03-11 11:03:22' 
            }
        }
    }
};
