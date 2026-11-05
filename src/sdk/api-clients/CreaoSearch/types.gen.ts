// Use these request functions from "./sdk.gen.ts" or "./index.ts":
//
//   /**
//    * Search News and Information
//    *
//    * Performs a search query and returns results in the specified language.
//    */
//   export function search(opts: SearchData): Promise<{
//     error?: SearchErrors[keyof SearchErrors],
//     data?: SearchResponses[keyof SearchResponses],
//     request: Request,
//     response: Response }>;
//
//
// NOTICE: Please use default values from original openapi schema:
//
//    {
//      "openapi": "3.0.3",
//      "info": {
//        "title": "CloudsWaySearch API",
//        "description": "AI-powered search API for getting news and information. User provides search query and language, system constructs the full URL with query parameters.",
//        "version": "1.0.0"
//      },
//      "servers": [
//        {
//          "url": ""
//        }
//      ],
//      "paths": {
//        "/search/ZwEDEMkvaTthUZhz/smart": {
//          "get": {
//            "summary": "Search News and Information",
//            "description": "Performs a search query and returns results in the specified language.",
//            "operationId": "search",
//            "parameters": [
//              {
//                "$ref": "#/components/parameters/CreaoApiNameHeader"
//              },
//              {
//                "$ref": "#/components/parameters/CreaoApiPathHeader"
//              },
//              {
//                "$ref": "#/components/parameters/CreaoApiIdHeader"
//              },
//              {
//                "name": "q",
//                "in": "query",
//                "required": true,
//                "schema": {
//                  "type": "string"
//                },
//                "description": "Search query (e.g., \"weather\", \"AI agent news\")"
//              },
//              {
//                "name": "setLang",
//                "in": "query",
//                "required": false,
//                "schema": {
//                  "type": "string",
//                  "enum": [
//                    "en",
//                    "es",
//                    "fr",
//                    "de",
//                    "zh",
//                    "ja"
//                  ],
//                  "default": "en"
//                },
//                "description": "Language setting for search results"
//              }
//            ],
//            "responses": {
//              "200": {
//                "description": "Successful search response",
//                "content": {
//                  "application/json": {
//                    "schema": {
//                      "type": "object",
//                      "required": [
//                        "queryContext",
//                        "webPages"
//                      ],
//                      "properties": {
//                        "queryContext": {
//                          "type": "object",
//                          "required": [
//                            "originalQuery"
//                          ],
//                          "properties": {
//                            "originalQuery": {
//                              "type": "string",
//                              "description": "The original search query",
//                              "example": "shanghai"
//                            }
//                          }
//                        },
//                        "webPages": {
//                          "type": "object",
//                          "required": [
//                            "value"
//                          ],
//                          "properties": {
//                            "value": {
//                              "type": "array",
//                              "description": "Array of web page search results",
//                              "items": {
//                                "type": "object",
//                                "required": [
//                                  "name",
//                                  "url"
//                                ],
//                                "properties": {
//                                  "name": {
//                                    "type": "string",
//                                    "description": "Title of the web page",
//                                    "example": "Shanghai - Wikipedia"
//                                  },
//                                  "url": {
//                                    "type": "string",
//                                    "format": "uri",
//                                    "description": "URL of the web page",
//                                    "example": "https://en.wikipedia.org/wiki/Shanghai"
//                                  },
//                                  "displayUrl": {
//                                    "type": "string",
//                                    "description": "Display-friendly version of the URL",
//                                    "example": "https://en.wikipedia.org/wiki/Shanghai"
//                                  },
//                                  "snippet": {
//                                    "type": "string",
//                                    "description": "Brief excerpt or summary of the content",
//                                    "example": "Shanghai is a direct-administered municipality and the most populous urban area in China..."
//                                  },
//                                  "dateLastCrawled": {
//                                    "type": "string",
//                                    "format": "date-time",
//                                    "description": "When the content was last crawled",
//                                    "example": "2025-08-10T11:03:00Z"
//                                  },
//                                  "siteName": {
//                                    "type": "string",
//                                    "description": "Name of the website",
//                                    "example": "Wikipedia"
//                                  },
//                                  "datePublished": {
//                                    "type": "string",
//                                    "format": "date-time",
//                                    "description": "When the content was published (optional)",
//                                    "example": "2025-08-03T00:00:00Z"
//                                  },
//                                  "thumbnailUrl": {
//                                    "type": "string",
//                                    "format": "uri",
//                                    "description": "URL of thumbnail image (optional)",
//                                    "example": "https://www.bing.com/th?id=OIP.nC1rdCACAagIyg9pjPBTWgHaDt&w=80&h=80&c=1&pid=5.1"
//                                  }
//                                }
//                              }
//                            }
//                          }
//                        }
//                      }
//                    }
//                  }
//                }
//              },
//              "401": {
//                "description": "Unauthorized - Invalid or missing API key"
//              }
//            },
//            "security": [
//              {
//                "ApiKeyAuth": []
//              }
//            ]
//          }
//        }
//      },
//      "components": {
//        "securitySchemes": {
//          "BearerAuth": {
//            "type": "http",
//            "scheme": "bearer",
//            "bearerFormat": "JWT",
//            "description": "Bearer token authentication",
//            "x-bearer-token": "vEsmqzTy0oqHAuRkS1bh"
//          }
//        },
//        "schemas": {
//          "SearchResponse": {
//            "type": "object",
//            "required": [
//              "queryContext",
//              "webPages"
//            ],
//            "properties": {
//              "queryContext": {
//                "type": "object",
//                "required": [
//                  "originalQuery"
//                ],
//                "properties": {
//                  "originalQuery": {
//                    "type": "string",
//                    "description": "The original search query",
//                    "example": "shanghai"
//                  }
//                }
//              },
//              "webPages": {
//                "type": "object",
//                "required": [
//                  "value"
//                ],
//                "properties": {
//                  "value": {
//                    "type": "array",
//                    "description": "Array of web page search results",
//                    "items": {
//                      "type": "object",
//                      "required": [
//                        "name",
//                        "url"
//                      ],
//                      "properties": {
//                        "name": {
//                          "type": "string",
//                          "description": "Title of the web page",
//                          "example": "Shanghai - Wikipedia"
//                        },
//                        "url": {
//                          "type": "string",
//                          "format": "uri",
//                          "description": "URL of the web page",
//                          "example": "https://en.wikipedia.org/wiki/Shanghai"
//                        },
//                        "displayUrl": {
//                          "type": "string",
//                          "description": "Display-friendly version of the URL",
//                          "example": "https://en.wikipedia.org/wiki/Shanghai"
//                        },
//                        "snippet": {
//                          "type": "string",
//                          "description": "Brief excerpt or summary of the content",
//                          "example": "Shanghai is a direct-administered municipality and the most populous urban area in China..."
//                        },
//                        "dateLastCrawled": {
//                          "type": "string",
//                          "format": "date-time",
//                          "description": "When the content was last crawled",
//                          "example": "2025-08-10T11:03:00Z"
//                        },
//                        "siteName": {
//                          "type": "string",
//                          "description": "Name of the website",
//                          "example": "Wikipedia"
//                        },
//                        "datePublished": {
//                          "type": "string",
//                          "format": "date-time",
//                          "description": "When the content was published (optional)",
//                          "example": "2025-08-03T00:00:00Z"
//                        },
//                        "thumbnailUrl": {
//                          "type": "string",
//                          "format": "uri",
//                          "description": "URL of thumbnail image (optional)",
//                          "example": "https://www.bing.com/th?id=OIP.nC1rdCACAagIyg9pjPBTWgHaDt&w=80&h=80&c=1&pid=5.1"
//                        }
//                      }
//                    }
//                  }
//                }
//              }
//            }
//          },
//          "QueryContext": {
//            "type": "object",
//            "required": [
//              "originalQuery"
//            ],
//            "properties": {
//              "originalQuery": {
//                "type": "string",
//                "description": "The original search query",
//                "example": "shanghai"
//              }
//            }
//          },
//          "WebPages": {
//            "type": "object",
//            "required": [
//              "value"
//            ],
//            "properties": {
//              "value": {
//                "type": "array",
//                "description": "Array of web page search results",
//                "items": {
//                  "type": "object",
//                  "required": [
//                    "name",
//                    "url"
//                  ],
//                  "properties": {
//                    "name": {
//                      "type": "string",
//                      "description": "Title of the web page",
//                      "example": "Shanghai - Wikipedia"
//                    },
//                    "url": {
//                      "type": "string",
//                      "format": "uri",
//                      "description": "URL of the web page",
//                      "example": "https://en.wikipedia.org/wiki/Shanghai"
//                    },
//                    "displayUrl": {
//                      "type": "string",
//                      "description": "Display-friendly version of the URL",
//                      "example": "https://en.wikipedia.org/wiki/Shanghai"
//                    },
//                    "snippet": {
//                      "type": "string",
//                      "description": "Brief excerpt or summary of the content",
//                      "example": "Shanghai is a direct-administered municipality and the most populous urban area in China..."
//                    },
//                    "dateLastCrawled": {
//                      "type": "string",
//                      "format": "date-time",
//                      "description": "When the content was last crawled",
//                      "example": "2025-08-10T11:03:00Z"
//                    },
//                    "siteName": {
//                      "type": "string",
//                      "description": "Name of the website",
//                      "example": "Wikipedia"
//                    },
//                    "datePublished": {
//                      "type": "string",
//                      "format": "date-time",
//                      "description": "When the content was published (optional)",
//                      "example": "2025-08-03T00:00:00Z"
//                    },
//                    "thumbnailUrl": {
//                      "type": "string",
//                      "format": "uri",
//                      "description": "URL of thumbnail image (optional)",
//                      "example": "https://www.bing.com/th?id=OIP.nC1rdCACAagIyg9pjPBTWgHaDt&w=80&h=80&c=1&pid=5.1"
//                    }
//                  }
//                }
//              }
//            }
//          },
//          "WebPageResult": {
//            "type": "object",
//            "required": [
//              "name",
//              "url"
//            ],
//            "properties": {
//              "name": {
//                "type": "string",
//                "description": "Title of the web page",
//                "example": "Shanghai - Wikipedia"
//              },
//              "url": {
//                "type": "string",
//                "format": "uri",
//                "description": "URL of the web page",
//                "example": "https://en.wikipedia.org/wiki/Shanghai"
//              },
//              "displayUrl": {
//                "type": "string",
//                "description": "Display-friendly version of the URL",
//                "example": "https://en.wikipedia.org/wiki/Shanghai"
//              },
//              "snippet": {
//                "type": "string",
//                "description": "Brief excerpt or summary of the content",
//                "example": "Shanghai is a direct-administered municipality and the most populous urban area in China..."
//              },
//              "dateLastCrawled": {
//                "type": "string",
//                "format": "date-time",
//                "description": "When the content was last crawled",
//                "example": "2025-08-10T11:03:00Z"
//              },
//              "siteName": {
//                "type": "string",
//                "description": "Name of the website",
//                "example": "Wikipedia"
//              },
//              "datePublished": {
//                "type": "string",
//                "format": "date-time",
//                "description": "When the content was published (optional)",
//                "example": "2025-08-03T00:00:00Z"
//              },
//              "thumbnailUrl": {
//                "type": "string",
//                "format": "uri",
//                "description": "URL of thumbnail image (optional)",
//                "example": "https://www.bing.com/th?id=OIP.nC1rdCACAagIyg9pjPBTWgHaDt&w=80&h=80&c=1&pid=5.1"
//              }
//            }
//          }
//        },
//        "parameters": {
//          "CreaoApiNameHeader": {
//            "name": "X-CREAO-API-NAME",
//            "in": "header",
//            "required": true,
//            "schema": {
//              "type": "string",
//              "default": "CreaoSearch"
//            },
//            "description": "API name identifier - must be \"CreaoSearch\""
//          },
//          "CreaoApiIdHeader": {
//            "name": "X-CREAO-API-ID",
//            "in": "header",
//            "required": true,
//            "schema": {
//              "type": "string",
//              "default": "689979fee926f36a53ec0042"
//            },
//            "description": "API ID identifier - must be \"689979fee926f36a53ec0042\""
//          },
//          "CreaoApiPathHeader": {
//            "name": "X-CREAO-API-PATH",
//            "in": "header",
//            "required": true,
//            "schema": {
//              "type": "string",
//              "default": "/search/ZwEDEMkvaTthUZhz/smart"
//            },
//            "description": "API path identifier - must be \"/search/ZwEDEMkvaTthUZhz/smart\""
//          }
//        }
//      }
//    }
//
// 

export type ClientOptions = {
    baseUrl: '' | (string & {});
};

export type SearchResponse = {
    queryContext: {
        /**
         * The original search query
         */
        originalQuery: string;
    };
    webPages: {
        /**
         * Array of web page search results
         */
        value: Array<{
            /**
             * Title of the web page
             */
            name: string;
            /**
             * URL of the web page
             */
            url: string;
            /**
             * Display-friendly version of the URL
             */
            displayUrl?: string;
            /**
             * Brief excerpt or summary of the content
             */
            snippet?: string;
            /**
             * When the content was last crawled
             */
            dateLastCrawled?: string;
            /**
             * Name of the website
             */
            siteName?: string;
            /**
             * When the content was published (optional)
             */
            datePublished?: string;
            /**
             * URL of thumbnail image (optional)
             */
            thumbnailUrl?: string;
        }>;
    };
};

export type QueryContext = {
    /**
     * The original search query
     */
    originalQuery: string;
};

export type WebPages = {
    /**
     * Array of web page search results
     */
    value: Array<{
        /**
         * Title of the web page
         */
        name: string;
        /**
         * URL of the web page
         */
        url: string;
        /**
         * Display-friendly version of the URL
         */
        displayUrl?: string;
        /**
         * Brief excerpt or summary of the content
         */
        snippet?: string;
        /**
         * When the content was last crawled
         */
        dateLastCrawled?: string;
        /**
         * Name of the website
         */
        siteName?: string;
        /**
         * When the content was published (optional)
         */
        datePublished?: string;
        /**
         * URL of thumbnail image (optional)
         */
        thumbnailUrl?: string;
    }>;
};

export type WebPageResult = {
    /**
     * Title of the web page
     */
    name: string;
    /**
     * URL of the web page
     */
    url: string;
    /**
     * Display-friendly version of the URL
     */
    displayUrl?: string;
    /**
     * Brief excerpt or summary of the content
     */
    snippet?: string;
    /**
     * When the content was last crawled
     */
    dateLastCrawled?: string;
    /**
     * Name of the website
     */
    siteName?: string;
    /**
     * When the content was published (optional)
     */
    datePublished?: string;
    /**
     * URL of thumbnail image (optional)
     */
    thumbnailUrl?: string;
};

/**
 * API name identifier - must be "CreaoSearch"
 */
export type CreaoApiNameHeader = string;

/**
 * API ID identifier - must be "689979fee926f36a53ec0042"
 */
export type CreaoApiIdHeader = string;

/**
 * API path identifier - must be "/search/ZwEDEMkvaTthUZhz/smart"
 */
export type CreaoApiPathHeader = string;

export type SearchData = {
    body?: never;
    headers: {
        /**
         * API name identifier - must be "CreaoSearch"
         */
        'X-CREAO-API-NAME': string;
        /**
         * API path identifier - must be "/search/ZwEDEMkvaTthUZhz/smart"
         */
        'X-CREAO-API-PATH': string;
        /**
         * API ID identifier - must be "689979fee926f36a53ec0042"
         */
        'X-CREAO-API-ID': string;
    };
    path?: never;
    query: {
        /**
         * Search query (e.g., "weather", "AI agent news")
         */
        q: string;
        /**
         * Language setting for search results
         */
        setLang?: 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja';
    };
    url: '/search/ZwEDEMkvaTthUZhz/smart';
};

export type SearchErrors = {
    /**
     * Unauthorized - Invalid or missing API key
     */
    401: unknown;
};

export type SearchResponses = {
    /**
     * Successful search response
     */
    200: {
        queryContext: {
            /**
             * The original search query
             */
            originalQuery: string;
        };
        webPages: {
            /**
             * Array of web page search results
             */
            value: Array<{
                /**
                 * Title of the web page
                 */
                name: string;
                /**
                 * URL of the web page
                 */
                url: string;
                /**
                 * Display-friendly version of the URL
                 */
                displayUrl?: string;
                /**
                 * Brief excerpt or summary of the content
                 */
                snippet?: string;
                /**
                 * When the content was last crawled
                 */
                dateLastCrawled?: string;
                /**
                 * Name of the website
                 */
                siteName?: string;
                /**
                 * When the content was published (optional)
                 */
                datePublished?: string;
                /**
                 * URL of thumbnail image (optional)
                 */
                thumbnailUrl?: string;
            }>;
        };
    };
};

export type SearchResponse2 = SearchResponses[keyof SearchResponses];
