﻿using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace backend.Models
{
    public class Subcategory
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public int CategoryId { get; set; }
        public Category? Category { get; set; }
    }
}
