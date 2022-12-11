export enum Action {
    /**
     * do everything
     */
    MANAGE = 'manage',
    /**
     * create entities
     */
    CREATE = 'create',
    /**
     * read entities
     */
    READ = 'read',
    /**
     * list all entities; 
     * abbreviation instead of loading all and checking
     */
    LIST = 'list',
    /**
     * update entities
     */
    UPDATE = 'update',
    /**
     * delete entities
     */
    DELETE = 'delete',
}