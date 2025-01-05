
    /**
     * Helper to clean nested entities recursively and retain hierarchy
     * @param data Input data to clean
     * @returns Cleaned data with preserved structure
     */
    private cleanNestedEntities(data: any): any {
        if (Array.isArray(data)) {
            // Recursively clean each item in the array
            return data.map((item) => this.cleanNestedEntities(item));
        } else if (data && typeof data === 'object') {
            // Check if object keys are numeric and flatten if true
            if (Object.keys(data).every((key) => /^\d+$/.test(key))) {
                return Object.values(data).map((item) => this.cleanNestedEntities(item));
            }

            // Recursively clean nested objects while retaining child entities
            return Object.keys(data).reduce((acc, key) => {
                acc[key] = this.cleanNestedEntities(data[key]);
                return acc;
            }, {} as Record<string, any>);
        }
        // Return primitive values as-is
        return data;
    }


    /**
     * Helper to retain nested child entities and clean redundant numeric-key objects
     * @param data Input data to clean
     * @returns Cleaned data with retained child entities
     */
    private retainNestedChildEntities(data: any): any {
        if (Array.isArray(data)) {
            // Recursively clean each item in the array
            return data.map((item) => this.retainNestedChildEntities(item));
        } else if (data && typeof data === 'object' && !Array.isArray(data)) {
            // Check if object keys are numeric and flatten if true
            if (Object.keys(data).every((key) => /^\d+$/.test(key))) {
                return Object.values(data).map((item) => this.retainNestedChildEntities(item));
            }

            // Recursively clean nested objects while retaining child entities
            return Object.keys(data).reduce((acc, key) => {
                acc[key] = this.retainNestedChildEntities(data[key]);
                return acc;
            }, {} as Record<string, any>);
        }
        // Return data directly if it's not an array or object
        return data;
    }




