
<div class="container py-4">
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    <h4>Scrape Product from Fashion Nova</h4>
                </div>
                <div class="card-body">
                    @if(session('success'))
                        <div class="alert alert-success">
                            {{ session('success') }}
                        </div>
                    @endif

                    @if(session('error'))
                        <div class="alert alert-danger">
                            {{ session('error') }}
                        </div>
                    @endif

                    <form method="POST" action="{{ route('admin.products.scrape.store') }}">
                        @csrf
                        <div class="form-group mb-3">
                            <label for="url">Product URL</label>
                            <input 
                                type="url" 
                                class="form-control" 
                                id="url" 
                                name="url" 
                                value="https://www.fashionnova.com/products/abbey-high-rise-biker-short-black" 
                                required
                            >
                            <small class="form-text text-muted">Enter Fashion Nova product URL to scrape</small>
                        </div>
                        <button type="submit" class="btn btn-primary">Scrape Product</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
