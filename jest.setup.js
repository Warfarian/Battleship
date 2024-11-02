import '@testing-library/jest-dom';

// Mock for dataTransfer in drag events
Object.defineProperty(global, 'DataTransfer', {
    value: class DataTransfer {
        constructor() {
            this.data = {};
        }
        setData(format, data) {
            this.data[format] = data;
        }
        getData(format) {
            return this.data[format];
        }
    }
});

Object.defineProperty(global, 'DragEvent', {
    value: class DragEvent extends Event {
        constructor(type, options) {
            super(type, options);
            this.dataTransfer = new DataTransfer();
        }
    }
});