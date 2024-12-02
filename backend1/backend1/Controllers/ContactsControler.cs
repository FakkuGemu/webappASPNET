using backend.Models;
using backend1.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ContactsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetContacts()
        {
            return Ok(await _context.Contacts.ToListAsync());
        }
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> AddContact([FromBody] Contact contact)
        {
            Console.WriteLine($"Received contact: {System.Text.Json.JsonSerializer.Serialize(contact)}");

            if (!ModelState.IsValid)
            {
                Console.WriteLine("ModelState Errors: ");
                foreach (var error in ModelState.Values.SelectMany(v => v.Errors))
                {
                    Console.WriteLine(error.ErrorMessage);
                }
                return BadRequest(ModelState);
            }

            if (contact.CategoryId == 3 && contact.Subcategory != null && !string.IsNullOrEmpty(contact.Subcategory.Name))
            {
                var existingSubcategory = _context.Subcategories
                    .FirstOrDefault(s => s.Name == contact.Subcategory.Name && s.CategoryId == contact.CategoryId);

                if (existingSubcategory == null)
                {
                    var newSubcategory = new Subcategory
                    {
                        Name = contact.Subcategory.Name,
                        CategoryId = contact.CategoryId
                    };

                    _context.Subcategories.Add(newSubcategory);
                    _context.SaveChanges();

                    contact.SubcategoryId = newSubcategory.Id;
                }
                else
                {
                    contact.SubcategoryId = existingSubcategory.Id;
                }
            }


            _context.Contacts.Add(contact);
            _context.SaveChanges();

            return Ok(contact);
        
        }
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateContact(int id, [FromBody] Contact contact)
        {
            if (id != contact.Id)
            {
                return BadRequest();
            }

            _context.Entry(contact).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Contacts.Any(e => e.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContact(int id)
        {
            var contact = await _context.Contacts.FindAsync(id);
            if (contact == null)
            {
                return NotFound();
            }

            _context.Contacts.Remove(contact);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
