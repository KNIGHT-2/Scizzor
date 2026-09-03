package com.knight.scizzor.dto;

public class PublicServiceDto {
    private Long id;
    private String name;
    private Double price;
    private Integer durationMinutes;

    public PublicServiceDto() {}

    public PublicServiceDto(Long id, String name, Double price, Integer durationMinutes) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.durationMinutes = durationMinutes;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
}
