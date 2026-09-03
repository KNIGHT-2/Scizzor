package com.knight.scizzor.dto;

public class PublicProductDto {
    private Long id;
    private String name;
    private Double price;
    private Integer quantity;
    private Boolean inStock;

    public PublicProductDto() {}

    public PublicProductDto(Long id, String name, Double price, Integer quantity) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.inStock = quantity != null && quantity > 0;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
        this.inStock = quantity != null && quantity > 0;
    }

    public Boolean getInStock() { return inStock; }
    public void setInStock(Boolean inStock) { this.inStock = inStock; }
}
