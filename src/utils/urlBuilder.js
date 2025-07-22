export class URLBuilder {
    constructor(baseUrl) {
        this.baseUrl = baseUrl.replace(/\/$/, ""); 
        this.params = new Map();
        this.path = "";
    }

    setPath(path) {
        this.path = path.startsWith("/") ? path : `/${path}`;
        return this;
    }

    addParam(key, value) {
        if (value !== null && value !== undefined) {
            this.params.set(key, value);
        }
        return this;
    }

    addParams(params) {
        Object.entries(params).forEach(([key, value]) => {
            this.addParam(key, value);
        });
        return this;
    }

    build() {
        let url = `${this.baseUrl}${this.path}`;
        
        if (this.params.size > 0) {
            const searchParams = new URLSearchParams();
            this.params.forEach((value, key) => {
                searchParams.append(key, value);
            });
            url += `?${searchParams.toString()}`;
        }
        
        return url;
    }

    static create(baseUrl) {
        return new URLBuilder(baseUrl);
    }
}